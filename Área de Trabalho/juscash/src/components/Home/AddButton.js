import { Button } from "../../assets/style/addButtonStyle.js";
export default function AddButton({ text, onClick }) {
  return <Button onClick={onClick}> {text}</Button>;
}
