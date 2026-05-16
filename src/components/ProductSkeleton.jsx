export default function ProductSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      {/* IMAGE PLACEHOLDER */}
      <div className="relative aspect-[4/5] rounded-2xl bg-slate-200 mb-5 w-full"></div>
      
      {/* CONTENT PLACEHOLDER */}
      <div className="flex flex-col flex-grow px-1 sm:px-2 mt-2 sm:mt-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mb-1 sm:mb-2">
          {/* Title Placeholder */}
          <div className="h-5 sm:h-6 bg-slate-200 rounded-md w-3/4"></div>
          {/* Price Placeholder */}
          <div className="h-4 sm:h-5 bg-slate-200 rounded-md w-1/3 mt-1 sm:mt-0"></div>
        </div>
        {/* Description Placeholder */}
        <div className="h-3 sm:h-4 bg-slate-200 rounded-md w-full mt-2"></div>
        <div className="h-3 sm:h-4 bg-slate-200 rounded-md w-5/6 mt-1.5"></div>
      </div>
    </div>
  );
}
