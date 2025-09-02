import ActivityPostCard from './ActivityPostCard'
const mockPosts = [
  {
    user: {
      name: 'Alice Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      isVerified: true,
    },
    location: 'Manila, Philippines',
    content:
      '<p>We have extra bottled water and power banks available for anyone nearby. Please bring your own containers if possible.</p>',
    helpType: 'Offering Help' as const,
    offeredHelp: ['Water', 'Wifi'],
    createdAt: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    postedById: '1',
    loginUserId: '1',
  },
  {
    user: {
      name: 'Brian Lee',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      isVerified: false,
    },
    location: 'Jakarta, Indonesia',
    content:
      '<p>Our area was heavily flooded. We are in urgent need of food and temporary shelter for 3 families.</p>',
    helpType: 'Need Help' as const,
    offeredHelp: ['Food', 'Shelter'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    postedById: '2',
    loginUserId: '1',
  },
  {
    user: {
      name: 'Clara Smith',
      avatar: null,
      isVerified: true,
    },
    location: 'Kathmandu, Nepal',
    content:
      '<p>Setting up a community space with WiFi and warm meals. Volunteers are welcome to join us!</p>',
    helpType: 'Offering Help' as const,
    offeredHelp: ['Food', 'Wifi', 'Shelter'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    postedById: '3',
    loginUserId: '1',
  },
]
export const FavFeed = () => {
  return (
    <div className='fade-in flex h-full w-full'>
      <div className='scrollbar-hide flex flex-1 flex-col gap-y-3 overflow-y-auto'>
        {mockPosts.map((post, idx) => (
          <ActivityPostCard key={idx} {...post} />
        ))}
      </div>
    </div>
  )
}
