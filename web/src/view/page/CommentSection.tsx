import { useQuery } from '@apollo/client'
import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { FetchComments, FetchComments_comments } from '../../graphql/query.gen'
import { Spacer } from '../../style/spacer'
import { AppRouteParams } from '../nav/route'
import { fetchComments } from '../playground/mutateComments'
import { AuthorComment } from './AuthorComment'
import { CommentCard } from './Comment'

interface CommentsProps extends RouteComponentProps, AppRouteParams {
  comments: string[]
  names: string[]
  dates: string[]
  hikeid: number
}

function getOldComments(id: number) {
  const { data } = useQuery<FetchComments>(fetchComments, {
    fetchPolicy: 'no-cache',
  })
  console.log('getting old comments')
  if (data) {
    console.log(data)
    const comments = data.comments
    comments.reverse()
    const output: FetchComments_comments[] = []

    comments.forEach(comment => {
      if (comment.hikeNum == id) {
        output.push(comment)
      }
    })

    return output.map(comment => (
      // eslint-disable-next-line react/jsx-key
      <CommentCard message={comment.text} name={comment.name} time={comment.date} />
    ))
  } else {
    return []
  }
}

export function CommentsSection(props: CommentsProps) {
  const [comments, setComments] = React.useState<string[]>(props.comments)
  const [names, setNames] = React.useState<string[]>(props.names)
  const [dates, setDates] = React.useState<string[]>(props.dates)

  return (
    <div>
      <Spacer $h4 />
      <div>
        <AuthorComment
          comments={comments}
          names={names}
          dates={dates}
          setCommentsCallback={setComments}
          setNamesCallback={setNames}
          setDatesCallback={setDates}
          hikeid={props.hikeid}
        />
      </div>
      <Spacer $h4 />
      <div>
        {comments.map((comment, index) => (
          // eslint-disable-next-line react/jsx-key
          <CommentCard message={comment} name={names[index]} time={dates[index]} />
        ))}
        {getOldComments(props.hikeid)}
      </div>
      <Spacer $h4 />
    </div>
  )
}
