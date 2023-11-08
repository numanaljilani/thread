"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { UserValidation } from "@/lib/validations/user";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import Image from "next/image";
import { useState, ChangeEvent } from "react";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter, usePathname } from 'next/navigation';
import { updateUser } from "@/lib/actions/user.action";


interface props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string
  };
  btnTitle: string

}

function AccountProfile({ user, btnTitle }: props) {
  const [files, setFiles] = useState<File[]>([])
  const { startUpload } = useUploadThing("media");

  const router = useRouter();
  const pahtname = usePathname();
  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    }
  })

  const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    e.preventDefault()
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setFiles(Array.from(e.target.files));
      if (!file.type.includes('image')) return;

      fileReader.onload = async (event) => {
        const imageUrl = event.target?.result?.toString() || ""
        fieldChange(imageUrl);
      }
      fileReader.readAsDataURL(file)
    }
  }


  async function onSubmit(values: z.infer<typeof UserValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    const blob = values.profile_photo

    const hasImageChange = isBase64Image(blob)
    if (hasImageChange) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].fileUrl) {
        values.profile_photo = imgRes[0].fileUrl
      }
    }

    await updateUser({
      userId: user.id,
      name: user.name,
      username: values.username,
      bio: values.bio,
      image: values.profile_photo,
      path: pahtname
    });

    router.push("/")
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {
                  field.value ? (<Image src={field.value} alt="" width={96} height={96} priority className="rounded-full object-cover" />) : (<Image src="/profile.svg" alt="" width={24} height={24} className="" />)
                }
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  placeholder="Upload a photo"
                  className="account-form_image-input"
                  accept="Image/*"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-white text-base-semibold">
                name
              </FormLabel>
              <FormControl className="flex text-gray-200 text-base-semibold">
                <Input
                  type="text"
                  placeholder="name"
                  className="account-form_input no-focus"
                  {...field}
                // onChange={(e)=> handleImage(e,field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-light-2 text-base-semibold">
                username
              </FormLabel>
              <FormControl className="flex text-gray-200 text-base-semibold">
                <Input
                  type="text"
                  placeholder="username"
                  className="account-form_input no-focus"
                  {...field}
                // onChange={(e)=> handleImage(e,field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-light-2 text-base-semibold">
                Bio
              </FormLabel>
              <FormControl className="flex text-gray-200 text-base-semibold">
                <Textarea
                  rows={10}
                  placeholder="Bio"
                  className="account-form_input no-focus"
                  {...field}
                // onChange={(e)=> handleImage(e,field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">Submit</Button>
      </form>
    </Form>
  )
}

export default AccountProfile