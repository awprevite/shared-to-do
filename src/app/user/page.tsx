'use client';
import Header from '../components/Header'
import List from '../components/List'

export default function User() {

  return (
    <>
      <Header email='test@gmail.com' groupName='Test Name'/>
      <List items={['group 1', 'group 2']} renderItems={(name) => <p>{name}</p>} emptyMessage='No items' />
    </>
  )
}