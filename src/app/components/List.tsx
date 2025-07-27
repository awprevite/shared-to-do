'use client';

type ListProps<T> = {
  title: string;
  items: T[];
  renderItems: (item: T, index: number) => React.ReactNode;
}

export default function List<T>({ title, items, renderItems }: ListProps<T>){

  return (
    <div className='flex flex-col justify-start items-start w-full w-full py-6'>
      <p className='font-bold p-2'>{title}</p>
          
        <div className='flex flex-col w-full justify-center bg-[var(--dark-accent)] rounded-lg'>

          {items.length === 0 ? (
            <p className='p-4'>&nbsp;</p>
          ) : (
            items.map((item, index) => (
              <div key={index} className='relative group flex justify-start items-center w-full p-4 border-b-4 border-[var(--bg-color)] last:border-b-0'>
                <div className='absolute left-0 top-[10%] h-[80%] w-1 bg-transparent group-hover:bg-[var(--light-accent)] rounded-r' />
                {renderItems(item, index)}
              </div>
            ))
          )} 
        </div>
    </div>
  )
}