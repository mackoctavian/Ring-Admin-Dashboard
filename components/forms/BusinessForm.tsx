"use client";
import CountrySelect from  "@/components/ui/country-picker"
import TimezonePicker from  "@/components/ui/timezone-picker"
import SlugGenerator from  "@/components/ui/slug-generator"
import { Button } from "@/components/ui/button";
import { UploadButton } from "@/components/ui/file-upload";
import { Textarea } from "@/components/ui/textarea"
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const ImgSchema = z.object({
  fileName: z.string(),
  name: z.string(),
  fileSize: z.number(),
  size: z.number(),
  fileKey: z.string(),
  key: z.string(),
  fileUrl: z.string(),
  url: z.string(),
});

export const IMG_MAX_LIMIT = 1;

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Business name must be at least 3 characters" }),
  imgUrl: z
    .array(ImgSchema)
    .max(IMG_MAX_LIMIT, { message: "You can only add one image" })
    .min(1, { message: "Pleaser upload business logo." }),
  slug: z
    .string()
    .min(1,  { message: "Business must have a slug" }),
  description: z
    .string()
    .min(3, { message: "Product description must be at least 3 characters" }),
  price: z.coerce.number(),
  category: z.string().min(1, { message: "Please select a category" }),
});

type BusinessFormValues = z.infer<typeof formSchema>;

interface BusinessFormProps {
  initialData: any | null;
  categories: any;
}

export const BusinessForm: React.FC<BusinessFormProps> = ({
  initialData,
  categories,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? "Edit business" : "Edit business";
  const description = initialData ? "Edit your business details." : "Edit your business details";
  const toastMessage = initialData ? "Business details updated." : "Business details updated.";
  const action = initialData ? "Save changes" : "Save changes";

  //TODO: Default timezone set
  //const [timezone, setTimezone] = useState<string>('eat');
  const [timezone, setTimezone] = useState<string | undefined>();
  const handleTimezoneChange = (value: string) => {
    setTimezone(value);
  };

  //const [branchTimezone, setBranchTimezone] = useState<string>('eat');
  const [branchTimezone, setBranchTimezone] = useState<string | undefined>();
  const handleBranchTimezoneChange = (value: string) => {
    setBranchTimezone(value);
  };


  //TODO: Default country set
  //const [country, setCountry] = useState<string>('TZ');
  const [country, setCountry] = useState<string | undefined>();
  const handleCountryChange = (value: string) => {
    setCountry(value);
  };


  const defaultValues = initialData
    ? initialData
    : {
        businessName: "",
        logo: "",
        slug: "",
        description: "",
        emailAddress: "",
        mobileNumber: "",
        phoneNumber: "",
        address: "",
        city: "",
        country: "",
        timeZone: "",
        currencies: [],
        businessCategories: [],
      };

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: BusinessFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        // await axios.post(`/api/products/edit-product/${initialData._id}`, data);
      } else {
        // const res = await axios.post(`/api/products/create-product`, data);
        // console.log("product", res);
      }
      router.refresh();
      router.push(`/dashboard`);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerImgUrlValidation = () => form.trigger("imgUrl");

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >

          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business name</FormLabel>
                  <FormControl>
                    <SlugGenerator loading={loading} placeholder="Business name" field={field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Email Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Mobile Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Phone Number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="City"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <CountrySelect value={country} onChange={handleCountryChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeZone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Zone</FormLabel>
                  <FormControl>
                    <TimezonePicker value={timezone} onChange={handleTimezoneChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currencies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Currency"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessCategories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Categories</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Business Categories"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:grid md:grid-cols-1 gap-8">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Business description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <div className="flex items-center justify-between">
              <Heading title="Main Branch" description="Edit main branch details" />
              {initialData && (
                <Button
                  disabled={loading}
                  variant="destructive"
                  size="sm"
                  onClick={() => setOpen(true)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Separator />
          </div>

          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="branchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch name</FormLabel>
                  <FormControl>
                    <SlugGenerator loading={loading} placeholder="Branch name" field={field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branchEmailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Email Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branchPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branchAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branchCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="openingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opening Time</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Opening Time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="closingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Closing Time</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Closing Time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branchTimeZone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Zone</FormLabel>
                  <FormControl>
                    <TimezonePicker value={branchTimezone} onChange={handleBranchTimezoneChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};