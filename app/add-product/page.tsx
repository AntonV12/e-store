import AddProduct from "@/components/add-product/AddProduct";
import { verifySession } from "@/lib/authActions";

export default async function AddProductPage() {
  const { isAdmin } = await verifySession();

  const initialProduct = {
    id: 0,
    name: "",
    category: "",
    viewed: 0,
    rating: 0,
    cost: 0,
    imageSrc: [],
    description: "",
    comments: [],
  };

  if (!isAdmin) {
    return <h1>Вы не можете добавлять продукты</h1>;
  }

  return <AddProduct product={initialProduct} isEdit={false} />;
}
