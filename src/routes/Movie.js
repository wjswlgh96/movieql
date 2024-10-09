import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

const GET_MOVIE = gql`
  query getMovie($movieId: String!) {
    movie(id: $movieId) {
      id
      title
      rating
      medium_cover_image
      isLiked @client
    }
  }
`;

export default function Movie() {
  const { id } = useParams();
  const {
    data,
    loading,
    client: { cache },
  } = useQuery(GET_MOVIE, { variables: { movieId: id } });

  if (loading) {
    return <h1>로딩중...</h1>;
  }
  const { title, rating, medium_cover_image, isLiked } = data.movie;

  const onClick = () => {
    cache.writeFragment({
      id: `Movie:${id}`,
      fragment: gql`
        fragment MovieFragment on Movie {
          isLiked
        }
      `,
      data: {
        isLiked: !isLiked,
      },
    });
  };

  return (
    <div>
      <div>
        <h1>{title}</h1>
        <h4>✅ {rating}</h4>
        <button onClick={onClick}>{isLiked ? "Unlike" : "Like"}</button>
      </div>
      <img src={`${medium_cover_image}`} alt={`${medium_cover_image}`} />
    </div>
  );
}
