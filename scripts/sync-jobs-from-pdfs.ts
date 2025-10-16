import * as fs from 'fs';
import * as path from 'path';
import pdfParse from 'pdf-parse';

interface ExtractedJobData {
  slug: string;
  title: string;
  summary?: string;
  responsibilities?: string[];
  requirements?: string[];
  niceToHave?: string[];
  missingSections: string[];
}

interface SyncReport {
  jobTitle: string;
  slug: string;
  summary: { status: 'present' | 'missing' | 'updated'; itemCount?: number };
  responsibilities: { status: 'present' | 'missing' | 'updated'; itemCount?: number };
  requirements: { status: 'present' | 'missing' | 'updated'; itemCount?: number };
  niceToHave: { status: 'present' | 'missing' | 'updated'; itemCount?: number };
  changes: string[];
}

const jobSlugs = [
  { slug: 'copywriter', title: 'Copywriter', pdf: 'attached_assets/jobDescriptions/Job Description- Copywriter.pdf' },
  { slug: 'designer', title: 'Graphic Designer', pdf: 'attached_assets/jobDescriptions/Job Description- Designer.pdf' },
  { slug: 'financial-officer', title: 'Financial Officer', pdf: 'attached_assets/jobDescriptions/Job Description- Financial Officer.pdf' },
  { slug: 'head-of-media', title: 'Head of Media', pdf: 'attached_assets/jobDescriptions/Job Description- Head of Media.pdf' },
  { slug: 'project-manager', title: 'Project Manager', pdf: 'attached_assets/jobDescriptions/Job Description- Project Mangment.pdf' },
  { slug: 'quality-assurance-officer', title: 'Quality Assurance Officer', pdf: 'attached_assets/jobDescriptions/Job Description- Quality Assurance Officer.pdf' },
  { slug: 'video-editor', title: 'Video Editor', pdf: 'attached_assets/jobDescriptions/Job Description- Video Editor.pdf' },
];

async function extractJobDataFromPDF(pdfPath: string): Promise<{ text: string; success: boolean }> {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    return { text: data.text, success: true };
  } catch (error) {
    console.error(`Error parsing PDF ${pdfPath}:`, error);
    return { text: '', success: false };
  }
}

function extractSectionFromText(
  text: string,
  sectionName: string,
  nextSectionNames: string[] = []
): { content: string; found: boolean } {
  // Normalize text for matching
  const normalizedText = text.toLowerCase();
  const normalizedSection = sectionName.toLowerCase();
  
  // Find section start
  const sectionIndex = normalizedText.indexOf(normalizedSection);
  if (sectionIndex === -1) {
    return { content: '', found: false };
  }

  // Find section end (next section or end of text)
  let endIndex = text.length;
  for (const nextSection of nextSectionNames) {
    const nextIndex = normalizedText.indexOf(nextSection.toLowerCase(), sectionIndex + sectionName.length);
    if (nextIndex !== -1 && nextIndex < endIndex) {
      endIndex = nextIndex;
    }
  }

  const content = text.substring(sectionIndex + sectionName.length, endIndex).trim();
  return { content, found: true };
}

function extractBulletPoints(text: string): string[] {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  const points: string[] = [];
  
  for (const line of lines) {
    // Match various bullet patterns
    const match = line.match(/^[•\-\*\d+\.]+\s*(.+)$/);
    if (match) {
      points.push(match[1].trim());
    } else if (line && !line.match(/^[A-Z\s]+$/) && line.length > 10) {
      // Include longer lines that aren't just headers
      points.push(line);
    }
  }
  
  return points.filter((p, i, arr) => arr.indexOf(p) === i); // Remove duplicates
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

async function syncJobsFromPDFs(): Promise<void> {
  const reports: SyncReport[] = [];
  const extractedJobs: Record<string, Partial<ExtractedJobData>> = {};

  console.log('Starting job synchronization from PDFs...\n');

  for (const job of jobSlugs) {
    console.log(`Processing: ${job.title}...`);
    
    const { text, success } = await extractJobDataFromPDF(job.pdf);
    if (!success) {
      console.warn(`  ⚠️ Failed to parse PDF`);
      continue;
    }

    const extracted: ExtractedJobData = {
      slug: job.slug,
      title: job.title,
      missingSections: []
    };

    // Define section names and related aliases
    const sectionKeywords = {
      summary: ['overview', 'job summary', 'job description', 'position overview'],
      responsibilities: ['responsibilities', 'duties', 'key responsibilities', 'role responsibilities', 'main responsibilities'],
      requirements: ['requirements', 'qualifications', 'required qualifications', 'minimum requirements', 'essential requirements'],
      niceToHave: ['preferred', 'nice to have', 'desirable', 'preferred qualifications', 'additional qualifications']
    };

    // Try to extract overview/summary (usually at beginning)
    const firstNewline = text.indexOf('\n');
    const firstPara = text.substring(0, firstNewline > 0 ? firstNewline : Math.min(200, text.length));
    if (firstPara.length > 50) {
      extracted.summary = cleanText(firstPara);
    } else {
      extracted.missingSections.push('summary');
    }

    // Extract responsibilities
    let respSection = extractSectionFromText(
      text,
      'Responsibilities',
      ['Requirements', 'Qualifications', 'Preferred', 'Nice to Have', 'Benefits', 'About']
    );
    if (!respSection.found) {
      respSection = extractSectionFromText(text, 'Duties', ['Requirements', 'Qualifications']);
    }
    if (respSection.found && respSection.content) {
      extracted.responsibilities = extractBulletPoints(respSection.content);
    } else {
      extracted.missingSections.push('responsibilities');
    }

    // Extract requirements
    let reqSection = extractSectionFromText(
      text,
      'Requirements',
      ['Preferred', 'Nice to Have', 'Benefits', 'Responsibilities', 'About']
    );
    if (!reqSection.found) {
      reqSection = extractSectionFromText(text, 'Qualifications', ['Preferred', 'Nice to Have', 'Benefits']);
    }
    if (reqSection.found && reqSection.content) {
      extracted.requirements = extractBulletPoints(reqSection.content);
    } else {
      extracted.missingSections.push('requirements');
    }

    // Extract nice to have / preferred
    let niceSection = extractSectionFromText(
      text,
      'Preferred',
      ['Benefits', 'About', 'How to Apply']
    );
    if (!niceSection.found) {
      niceSection = extractSectionFromText(text, 'Nice to Have', ['Benefits', 'About']);
    }
    if (niceSection.found && niceSection.content) {
      extracted.niceToHave = extractBulletPoints(niceSection.content);
    }

    extractedJobs[job.slug] = extracted;

    // Build report
    const report: SyncReport = {
      jobTitle: job.title,
      slug: job.slug,
      summary: extracted.summary ? { status: 'present', itemCount: extracted.summary.length } : { status: 'missing' },
      responsibilities: extracted.responsibilities && extracted.responsibilities.length > 0 
        ? { status: 'present', itemCount: extracted.responsibilities.length } 
        : { status: 'missing' },
      requirements: extracted.requirements && extracted.requirements.length > 0
        ? { status: 'present', itemCount: extracted.requirements.length }
        : { status: 'missing' },
      niceToHave: extracted.niceToHave && extracted.niceToHave.length > 0
        ? { status: 'present', itemCount: extracted.niceToHave.length }
        : { status: 'missing' },
      changes: []
    };

    reports.push(report);
    console.log(`  ✓ Extracted: ${report.responsibilities.itemCount || 0} responsibilities, ${report.requirements.itemCount || 0} requirements`);
    if (extracted.missingSections.length > 0) {
      console.log(`  ⚠️ Missing sections: ${extracted.missingSections.join(', ')}`);
    }
  }

  // Generate report file
  console.log('\nGenerating sync report...');
  let reportMarkdown = '# Job Sync Report\n\n';
  reportMarkdown += `Generated: ${new Date().toISOString()}\n\n`;
  reportMarkdown += 'This report documents the synchronization of job listings with their PDF descriptions.\n\n';

  for (const report of reports) {
    reportMarkdown += `## ${report.jobTitle}\n\n`;
    reportMarkdown += `**Slug:** \`${report.slug}\`\n\n`;
    reportMarkdown += `### Section Status\n\n`;
    reportMarkdown += `- **Summary:** ${report.summary.status}${report.summary.itemCount ? ` (${report.summary.itemCount} chars)` : ''}\n`;
    reportMarkdown += `- **Responsibilities:** ${report.responsibilities.status}${report.responsibilities.itemCount ? ` (${report.responsibilities.itemCount} items)` : ''}\n`;
    reportMarkdown += `- **Requirements:** ${report.requirements.status}${report.requirements.itemCount ? ` (${report.requirements.itemCount} items)` : ''}\n`;
    reportMarkdown += `- **Nice to Have:** ${report.niceToHave.status}${report.niceToHave.itemCount ? ` (${report.niceToHave.itemCount} items)` : ''}\n`;
    reportMarkdown += '\n';
  }

  reportMarkdown += '\n## Summary\n\n';
  const missingCount = reports.filter(r => 
    r.responsibilities.status === 'missing' || 
    r.requirements.status === 'missing' ||
    r.summary.status === 'missing'
  ).length;
  reportMarkdown += `- Total jobs processed: ${reports.length}\n`;
  reportMarkdown += `- Jobs with all sections: ${reports.length - missingCount}\n`;
  reportMarkdown += `- Jobs with missing sections: ${missingCount}\n\n`;

  if (missingCount > 0) {
    reportMarkdown += '### Jobs needing manual review:\n\n';
    for (const report of reports) {
      if (report.responsibilities.status === 'missing' || 
          report.requirements.status === 'missing' ||
          report.summary.status === 'missing') {
        reportMarkdown += `- **${report.jobTitle}**: Missing ${
          [
            report.summary.status === 'missing' ? 'summary' : null,
            report.responsibilities.status === 'missing' ? 'responsibilities' : null,
            report.requirements.status === 'missing' ? 'requirements' : null
          ].filter(Boolean).join(', ')
        }\n`;
      }
    }
  }

  fs.writeFileSync('SYNC_REPORT.md', reportMarkdown);
  console.log('✓ Sync report written to SYNC_REPORT.md');

  // Also output extracted data as JSON for reference
  const dataFile = {
    timestamp: new Date().toISOString(),
    jobs: extractedJobs
  };
  fs.writeFileSync('.jobs-extracted.json', JSON.stringify(dataFile, null, 2));
  console.log('✓ Extracted data saved to .jobs-extracted.json for reference');
}

syncJobsFromPDFs().catch(error => {
  console.error('Error during sync:', error);
  process.exit(1);
});
