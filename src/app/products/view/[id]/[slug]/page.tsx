import ProductPage from "./Productpage";


type Props = {
  params: { id: string; slug: string };
};

export default function Page({ params }: Props) {
  return <ProductPage />;
}
