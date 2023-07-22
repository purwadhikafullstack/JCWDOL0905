import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/api";

export const Category = () => {
  const [categories, setCategories] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await api.get("/category");
        setCategories(categoriesData.data.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="flex my-12 h-fit px-5 py-3 bg-white rounded-lg border border-gray-200 drop-shadow-md overflow-x-auto justify-between scrollbar-hide">
      {categories.map((category) => (
        <button key={category.id} className="mx-2 my-4 mb-4 h-fit w-16 md:w-24 md:h-24 md:mb-8 lg:w-34 lg:h-34 lg:mb-10">
          <a href={`/category/${category.id}`} className="flex flex-col justify-center items-center space-y-1">
            <img src={category.category_image} alt={category.category_name} className="w-full h-auto overflow-visible" />
            <div className="w-16 lg:w-28 mb-4 justify-center items-center mb-8">
              {id == category.id ? <div className=" font-semibold text-green-600 text-md mb-2">{category.category_name}</div> : <div className=" font-semibold text-gray-800 text-md mb-2">{category.category_name}</div>}
            </div>
          </a>
        </button>
      ))}
    </div>
  );
};
