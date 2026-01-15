"use client";

import { useEffect, useState } from "react";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { User } from "@/types/global";
import { useCart } from "../context/CartContext";

export default function CheckoutForm() {
  const { cart, clearCart } = useCart();
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    adress: "",
    street: "",
    city: "",
    zip: "",
    country: "",
    comment: "",
  });

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      const resNick = await fetch("/api/me", { cache: "no-store" });
      const dataNick = await resNick.json();
      if (!dataNick) return;

      const res = await fetch(`/api/user/${dataNick.user.nick_name}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (data) {
        setUser(data);
        setForm((prev) => ({
          ...prev,
          email: data.email || "",
          name: data.username || "",
          phone: data.telefon || "",
        }));
      }
    }

    loadUser();
  }, []);

  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);

  const handlePlaceChanged = () => {
    if (!searchBox) return;
    const places = searchBox.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    const components: Record<string, string> = {};

    place.address_components?.forEach((c) => {
      const types = c.types;
      if (types.includes("street_number"))
        components.street_number = c.long_name;
      if (types.includes("route")) components.route = c.long_name;
      if (types.includes("locality")) components.city = c.long_name;
      if (types.includes("postal_code")) components.zip = c.long_name;
      if (types.includes("country")) components.country = c.long_name;
    });

    const street = [components.route, components.street_number]
      .filter(Boolean)
      .join(" ");
    setForm((prev) => ({
      ...prev,
      street,
      city: components.city || "",
      zip: components.zip || "",
      country: components.country || "",
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (cart.items.length === 0) {
      alert("Warenkorb ist leer!");
      return;
    }

    const payload = {
      email: form.email,
      user_nick: user?.nick_name || null,
      name: form.name,
      street: form.street,
      zip: form.zip,
      city: form.city,
      country: form.country,
      comment: form.comment,
      cartItems: cart.items,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        clearCart();
        const checkoutRes = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: data.order.id,
            items: cart.items,
            deliveryPrice:data.order.delivery_price
          }),
        });

        const checkoutData = await checkoutRes.json();

        if (checkoutRes.ok && checkoutData.url) {
          // --->>> Stripe Checkout
          window.location.href = checkoutData.url;
        } else {
          console.error("Stripe Checkout failed", checkoutData.error);
          alert("Fehler beim Weiterleiten zu Stripe.");
        }
      } else {
        console.error("Order creation failed:", data.error);
        alert("Fehler beim Erstellen der Bestellung.");
      }
    } catch (error) {
      console.error(error);
      alert("Fehler beim Erstellen der Bestellung.");
    }
  }

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY!}
      libraries={["places"]}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-(--bg) p-6 rounded-lg main-shadow space-y-4 w-full mx-auto"
      >
        <h2 className="text-lg font-bold mb-4">Ihre Daten</h2>

        {/* e-mail name */}

        <div className="flex flex-col lg:flex-row gap-5 ">
          <div>
            <label> E-mail</label>
            <input
              name="email"
              type="email"
              required
              placeholder="E-Mail"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded border-(--olive_bright)"
            />
          </div>

          <div>
            <label> Name Vorname</label>
            <input
              name="name"
              required
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded border-(--olive_bright)"
            />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <span>Telefonnummer</span>
          <input
            name="phone"
            type="tel"
            placeholder="+49"
            value={form.phone}
            onChange={handleChange}
            className="w-full max-w-[200px] p-3 border-b border-(--olive_bright) "
          />
        </div>
        {/* Autocomplete для адреси */}
        <label>
          Ihre Adresse{" "}
          <span className="text-sm text-(--text_gray)">(Lieferadresse)</span>
        </label>
        <StandaloneSearchBox
          onLoad={(ref) => setSearchBox(ref)}
          onPlacesChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="Adresse suchen..."
            className=" w-full p-3 border rounded border-(--olive_bright)"
          />
        </StandaloneSearchBox>
        <div className="pl-15 flex flex-col gap-4">
          <input
            name="street"
            value={form.street}
            onChange={handleChange}
            placeholder="Straße und Hausnumer"
            className="w-full p-3 border rounded border-(--olive)"
          />
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Stadt"
            className="w-full p-3 border rounded border-(--olive)"
          />
          <input
            name="zip"
            value={form.zip}
            onChange={handleChange}
            placeholder="Postleitzahl"
            className="w-full p-3 border rounded border-(--olive)"
          />
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Land"
            className="w-full p-3 border rounded border-(--olive)"
          />
        </div>

        <textarea
          name="comment"
          placeholder="Kommentar (optional)"
          value={form.comment}
          onChange={handleChange}
          className="w-full mt-10 p-3 border rounded border-(--olive_bright)"
        />

        <button
          type="submit"
          className="w-full bg-(--olive_bright) text-white py-3 rounded font-bold hover:bg-(--orange)"
        >
          Bestellung bestätigen
        </button>
      </form>
    </LoadScript>
  );
}
