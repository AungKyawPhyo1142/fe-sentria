import Input from './Input'

const SearchInput = () => {
  return (
    <form action='' className='w-[300px]'>
      <Input
        showSearchIcon
        type='text'
        className='ps-11 text-sm'
        autoComplete='email'
        name='search'
        onChange={undefined}
        placeholder='Search'
      />
    </form>
  )
}

export default SearchInput
