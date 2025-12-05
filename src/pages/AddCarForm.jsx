import React, { useState, useEffect } from "react";
import { addCar, getBrands, getCarTypes, getDrivers } from "../api/cars";

const AddCarForm = ({ onCarAdded }) => {
  const [carNo, setCarNo] = useState("");
  const [model, setModel] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [noOfSeats, setNoOfSeats] = useState(5);
  const [ac, setAc] = useState(false);
  const [description, setDescription] = useState("");
  const [driverId, setDriverId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [carTypeId, setCarTypeId] = useState("");

  const [brands, setBrands] = useState([]);
  const [carTypes, setCarTypes] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    setBrands(await getBrands());
    setCarTypes(await getCarTypes());
    setDrivers(await getDrivers());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const carData = {
      carNo,
      model,
      fuelType,
      noOfSeats: Number(noOfSeats),
      ac,
      description,
      driverId: Number(driverId),
      brandId: Number(brandId),
      carTypeId: Number(carTypeId),
    };

    const newCar = await addCar(carData);

    if (newCar) {
      alert("Car added successfully!");
      onCarAdded(newCar); // Update parent list
      // Reset form
      setCarNo("");
      setModel("");
      setFuelType("");
      setNoOfSeats(5);
      setAc(false);
      setDescription("");
      setDriverId("");
      setBrandId("");
      setCarTypeId("");
    } else {
      alert("Failed to add car.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <div>
        <label>Car No: </label>
        <input type="text" value={carNo} onChange={(e) => setCarNo(e.target.value)} required />
      </div>

      <div>
        <label>Brand: </label>
        <select value={brandId} onChange={(e) => setBrandId(e.target.value)} required>
          <option value="">Select Brand</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Car Type: </label>
        <select value={carTypeId} onChange={(e) => setCarTypeId(e.target.value)} required>
          <option value="">Select Type</option>
          {carTypes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Model: </label>
        <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required />
      </div>

      <div>
        <label>Fuel Type: </label>
        <input type="text" value={fuelType} onChange={(e) => setFuelType(e.target.value)} required />
      </div>

      <div>
        <label>No of Seats: </label>
        <input type="number" value={noOfSeats} onChange={(e) => setNoOfSeats(e.target.value)} required />
      </div>

      <div>
        <label>AC: </label>
        <input type="checkbox" checked={ac} onChange={(e) => setAc(e.target.checked)} />
      </div>

      <div>
        <label>Description: </label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div>
        <label>Driver: </label>
        <select value={driverId} onChange={(e) => setDriverId(e.target.value)} required>
          <option value="">Select Driver</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
          ))}
        </select>
      </div>

      <button type="submit" style={{ marginTop: "10px" }}>Add Car</button>
    </form>
  );
};

export default AddCarForm;







