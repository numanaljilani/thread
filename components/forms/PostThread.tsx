"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { useState, ChangeEvent } from "react";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter, usePathname } from 'next/navigation';
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from '@/lib/actions/thread.action'



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


function PostThread({ userId }: { userId: string }) {


    const router = useRouter();
    const pahtname = usePathname();
    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: "",
            accountId: userId
        }
    });

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        await createThread({
            text : values.thread,
            author : userId,
            communityId : null,
            path : pahtname,
        });
        router.push('/');
    }
    return (<>
        <h1>Post thread form</h1>
        <Form {...form}>
            <form
                  onSubmit={form.handleSubmit(onSubmit)} 
                className="flex flex-col justify-start gap-10">
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                            <FormLabel className="text-light-2 text-base-semibold">
                                Thread
                            </FormLabel>
                            <FormControl className="flex text-gray-200 text-base-semibold">
                                <Textarea
                                    rows={10}
                                    placeholder="Thread"
                                    className="account-form_input no-focus"
                                    {...field}
                                // onChange={(e)=> handleImage(e,field.onChange)}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit"  className="bg-primary-500">Post Thread</Button>

            </form>
        </Form>



    </>
    )
}

export default PostThread