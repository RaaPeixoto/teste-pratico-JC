import { LoadingContainer } from "../assets/style/loadingStyle.js";
import gif from "../assets/images/gif.svg";
export default function Loading() {
  return (
    <LoadingContainer>
      <img src={gif} alt="loadingGif" />
    </LoadingContainer>
  );
}
