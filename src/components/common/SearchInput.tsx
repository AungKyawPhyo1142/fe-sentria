import Input from "./Input"

const SearchInput = () => {
    return (
        <form action="" className="w-[300px]">

            <Input
                showSearchIcon
                type='text'
                className="text-sm ps-11"
                autoComplete='email'
                name='search'
                onChange={undefined}
                placeholder="Search"
                
            />

        </form>
    )
}

export default SearchInput

