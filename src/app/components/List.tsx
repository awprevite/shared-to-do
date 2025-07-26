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
          
        <div className='flex flex-col w-full justify-center gap-2 bg-[var(--dark-accent)] rounded-lg'>

          {items.length === 0 ? (
            <p className='px-4 py-2'>&nbsp;</p>
          ) : (
            items.map((item, index) => (
              <div key={index} className='flex justify-start border-b-2 border-[var(--bg-color)] w-full px-4 py-2 last:border-b-0'>
                {renderItems(item, index)}
              </div>
            ))
          )} 
        </div>
    </div>
  )
}