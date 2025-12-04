import React, { useEffect, useState } from "react";
import { getCars } from "../api/cars";
import AddCarForm from "./AddCarForm";

const Cars = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const data = await getCars();
    setCars(data);
  };

  // Add new car to list
  const handleCarAdded = (newCar) => {
    setCars((prev) => [...prev, newCar]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Cars List</h1>

      <h2>Add New Car</h2>
      <AddCarForm onCarAdded={handleCarAdded} />

      <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Car No</th>
            <th>Brand</th>
            <th>Type</th>
            <th>Model</th>
            <th>Fuel</th>
            <th>Seats</th>
            <th>AC</th>
            <th>Driver</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td>{car.id}</td>
              <td>{car.carNo}</td>
              <td>{car.brand?.name}</td>
              <td>{car.carType?.name}</td>
              <td>{car.model}</td>
              <td>{car.fuelType}</td>
              <td>{car.noOfSeats}</td>
              <td>{car.ac ? "Yes" : "No"}</td>
              <td>{car.driver ? `${car.driver.firstName} ${car.driver.lastName}` : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cars;
