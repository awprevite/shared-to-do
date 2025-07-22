'use client';

type ListProps<T> = {
  title: string;
  items: T[];
  renderItems: (item: T, index: number) => React.ReactNode;
  emptyMessage: string;
}

export default function List<T>({ title, items, renderItems, emptyMessage }: ListProps<T>){

  return (
    <div className='flex flex-col justify-start w-full px-20 py-6'>

        {items.length === 0 ? (
          <p>{emptyMessage}</p>
        ) : (
          <>
          <p>{title}</p>
          <div className='flex flex-col w-full justify-center gap-2 bg-[var(--dark-accent)] rounded-lg p-2'>
            {items.map((item, index) => (
              <div key={index} className='flex justify-start'>
                {renderItems(item, index)}
              </div>
            ))}
          </div>
          </>
        )} 
    </div>
  )
}