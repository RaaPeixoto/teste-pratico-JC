import { PageContainer } from "../../assets/style/notFoundStyle.js";
import notFoundImage from "../../assets/images/404.png"
function NotFound() {
  return <PageContainer>
    <img src={notFoundImage} alt="not found image"/>
    <h3>Página não encontrada</h3>
  </PageContainer>;
}

export { NotFound };
