import React from 'react'

type PostProps = {
  year: string
  month: string
  id: string
}

export const Home = () => <p>Home</p>
export const Blog = () => <p>Blog</p>
export const Post = (props: PostProps) => <p>Post {JSON.stringify(props)}</p>
export const NotFound = () => <p>NotFound</p>
