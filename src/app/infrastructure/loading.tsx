export default function InfrastructureLoading() {
  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 animate-pulse">
      <div className="h-6 w-48 bg-white/5 rounded-full mb-6" />
      <div className="h-12 w-96 bg-white/5 rounded-2xl mb-4" />
      <div className="h-6 w-full max-w-xl bg-white/5 rounded-xl mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-64 bg-white/[0.03] rounded-[22px] border border-white/5" />
        <div className="h-64 bg-white/[0.03] rounded-[22px] border border-white/5" />
        <div className="h-64 bg-white/[0.03] rounded-[22px] border border-white/5" />
      </div>
    </div>
  );
}

