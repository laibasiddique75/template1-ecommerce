"use client";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { client } from "@/sanity/lib/client";
import { Bounce, toast, ToastContainer } from "react-toastify";
// import { clearCart } from "../Redux/feature/cartSlice";
import { useRouter } from "next/navigation";

import { clearCart } from "../Redux/feature/cartSlice";
const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  phoneNumber: z.string().regex(/^\d{10,}$/, "Phone number must be at least 10 digits"),
});

type FormType = z.infer<typeof formSchema>;

function Checkout() {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const cartArray = useSelector((state: any) => state.cart || []);
  
  const total = cartArray.reduce((total: number, item: any) => {
    const discountedPrice = item.discount > 0 ? item.price - (item.price * item.discount) / 100 : item.price;
    return total + discountedPrice * item.qty;
  }, 0);
  
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: { fullName: "", email: "", shippingAddress: "", phoneNumber: "" },
  });
  
  async function onSubmit(values: FormType) {
    try {
      const shippingForm = await client.create({
        _type: "contactForm",
        ...values,
      });

      await client.create({
        _type: "orders",
        shippingForm: { _ref: shippingForm._id },
        products: cartArray.map((product: any) => ({
          TrackingId: `${values.fullName}-${Math.random()}`,
          name: product.name,
          price: product.price,
          qty: product.qty,
        })),
      });

      toast.success("Order placed successfully!", { position: "bottom-right", autoClose: 5000, transition: Bounce });
      dispatch(clearCart());
      form.reset();
      router.push("/payment");
    } catch (error) {
      toast.error("Failed to place order. Try again.", { position: "bottom-right", transition: Bounce });
    }
  }

  return (
    <main className="mt-28 lg:mt-36">
      <div className="flex flex-col md:flex-row space-y-5 sm:space-y-0 p-5 justify-center items-start lg:space-x-6">
        {cartArray.length >= 1 && (
          <div className="w-full lg:w-[600px] space-y-4 border rounded-[20px] pt-2">
            <h1 className="text-2xl font-bold px-5">Order Summary</h1>
            {cartArray.map((data: any, index: any) => (
              <div className="flex justify-between items-start px-5" key={index}>
                <div className="flex items-start space-x-2">
                  <Image src={data.image} alt={data.name} width={100} height={100} />
                  <h1 className="sm:font-bold text-sm md:text-xl mt-3">{data.name}</h1>
                </div>
                <p className="font-bold mt-3">${data.price}</p>
              </div>
            ))}
            <div className="flex w-full justify-between p-5">
              <h1 className="font-bold">Total</h1>
              <h1 className="font-bold">${total}</h1>
            </div>
          </div>
        )}

        <div className="rounded-[20px] border p-5 w-full lg:w-[50%]">
          <h1 className="text-2xl font-bold mb-4">Shipping Details</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="Enter your full name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl><Input placeholder="Enter your email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="shippingAddress" render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Address</FormLabel>
                  <FormControl><Input placeholder="Enter your shipping address" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl><Input placeholder="Enter your phone number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <Button className="w-full" type="submit">Place Order</Button>
              <ToastContainer position="bottom-right" autoClose={5000} transition={Bounce} />
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}

export default Checkout;









