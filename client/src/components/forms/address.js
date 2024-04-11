import React, { useState, useEffect } from 'react';

export default function AddressAutocomplete({ address, setAddress }) {
  const [suggestions, setSuggestions] = useState([]);

  const fetchAddressSuggestions = async () => {
    try {
      const response = await fetch(
        //
        `https://nominatim.openstreetmap.org/search?format=json&q=${address}&countrycodes=IN&limit=5`
      );
  
      if (response.ok) {
        const data = await response.json();
        const formattedSuggestions = data.map((suggestion) => {
          // Extract the address without the pincode and "India"
          const addressParts = suggestion.display_name.split(', ');
          addressParts.pop(); // Remove the last part (pincode)
          addressParts.pop(); // Remove the second last part ("India")
          const cleanedAddress = addressParts.join(', ');
  
          return {
            display_name: cleanedAddress,
            // You can add more properties as needed
          };
        });
        setSuggestions(formattedSuggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  useEffect(() => {
    if (address.length > 2) {
      fetchAddressSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [address]);

  const handleSuggestionSelect = (selectedSuggestion) => {
    setAddress(selectedSuggestion.display_name);
    setSuggestions([]);
  };

  return (
    <div >
      <input
      className="mb-3 form-control"
        type="text"
        placeholder="Search for address..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <ul>
        {suggestions.map((suggestion, index) => (
          <li key={index} onClick={() => handleSuggestionSelect(suggestion)}>
            {suggestion.display_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
