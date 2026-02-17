const TrustScoreBadge = ({ score }: { score: number }) => {
  const getColor = () => {
    if (score <= 20) return 'text-danger bg-danger/8'
    if (score <= 50) return 'text-warning bg-warning/8'
    return 'text-primary bg-primary/8'
  }

  return (
    <div
      className={`flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold tabular-nums ${getColor()}`}
    >
      {score}
    </div>
  )
}

export default TrustScoreBadge
