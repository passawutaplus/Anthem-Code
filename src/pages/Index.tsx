import { useNavigate } from "react-router-dom";
import FeedPage from "@/pages/FeedPage";

const Index = () => {
  const navigate = useNavigate();
  return <FeedPage onMyPortClick={() => navigate("/portfolio")} />;
};

export default Index;
