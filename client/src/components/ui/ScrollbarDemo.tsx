export const ScrollbarDemo = () => {
  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="font-semibold text-lg mb-4">Overlay Scrollbar Demo</h3>
      <div className="h-32 overflow-y-auto bg-white p-4 rounded border scrollable-content">
        <p>This is a scrollable container to demonstrate the overlay scrollbar.</p>
        <p className="mt-2">The scrollbar appears as a slim blue thumb on top of the content.</p>
        <p className="mt-2">No track, no arrows, no reserved space.</p>
        <p className="mt-2">Content uses the full width of the container.</p>
        <p className="mt-2">Scroll down to see more content...</p>
        <p className="mt-2">Line 6</p>
        <p className="mt-2">Line 7</p>
        <p className="mt-2">Line 8</p>
        <p className="mt-2">Line 9</p>
        <p className="mt-2">Line 10</p>
        <p className="mt-2">Line 11</p>
        <p className="mt-2">Line 12</p>
        <p className="mt-2">Line 13</p>
        <p className="mt-2">Line 14</p>
        <p className="mt-2">Line 15 - End of demo content</p>
      </div>
    </div>
  );
};