const TrustScoreBadge = ({ score }: { score: number }) => {
  const getTrustScoreColor = (score: number) => {
    if (score <= 20) return 'bg-[#B22222]'
    if (score <= 69) return 'bg-[#F6BD16]'
    return 'bg-[#09CD5F]'
  }

  return (
    <div
      className={`flex h-[30px] w-[30px] items-center justify-center rounded-full px-2 py-1 text-xs font-medium text-white ${getTrustScoreColor(score)}`}
    >
      {score}%
    </div>
  )
}
export default TrustScoreBadge
