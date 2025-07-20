'use client';

type ListProps<T> = {
  items: T[];
  renderItems: (item: T, index: number) => React.ReactNode;
  emptyMessage: string;
}

export default function List<T>({items, renderItems, emptyMessage}: ListProps<T>){

  return (
    <div className='flex flex-col justify-center gap-2 bg-gray-500/20 rounded-lg border border-solid border-[var(--fg-color)]'>

      {items.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        items.map((item, index) => (
          <div key={index} className='flex justify-start'>
            {renderItems(item, index)}
          </div>
        )) 
      )} 
    </div>
  )
}