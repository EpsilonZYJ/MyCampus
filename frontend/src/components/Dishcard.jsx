// src/components/DishCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { getDishImage } from "../api/dish";
import "./DishCard.css";

export default function DishCard({ dish }) {
  const navigate = useNavigate();

  return (
    <div className="dish-card" onClick={() => navigate(`/dish/${dish.id}`)}>
      <img src={getDishImage(dish.id)} alt={dish.name} />
      <div className="dish-card-name">{dish.name}</div>
    </div>
  );
}
