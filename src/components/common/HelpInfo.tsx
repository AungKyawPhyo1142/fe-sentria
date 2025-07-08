import clsx from "clsx";

const HelpInfo = ({ title, type }: { title: string; type: string }) => {
  return (
    <div className='flex flex-row items-center gap-x-2 p-2'>
      <div
        className={clsx(
          'h-5 w-5 rounded-full',
          type === 'available' ? 'bg-secondary' : 'bg-red',
        )}
      ></div>
      <span className='font-medium text-black'>{title}</span>
    </div>
  )
}

export default HelpInfo;