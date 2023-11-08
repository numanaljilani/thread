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
import { Input } from "@/components/ui/input"
import { useState, ChangeEvent } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { CommentValidation } from "@/lib/validations/thread";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.action";

interface props {
    threadId: string;
    currentUserImg: string;
    currentUserId: string
}
function Comments({ threadId, currentUserImg, currentUserId }: props) {

    const router = useRouter();
    const pahtname = usePathname();
    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: "",
            accountId: ""
        }
    });

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread(
            threadId,
            values.thread,
            JSON.parse(currentUserId),
            pahtname,

        );
        form.reset();
    }


    return (<>
        <h1>Post thread form</h1>
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="comment-form">
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-3 w-full">
                            <FormLabel >
                                <Image src={currentUserImg} alt="user" width={48} height={48} className="rounded-full object-cover" />
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input
                                    placeholder="comment"
                                    className="account-form_input no-focus"
                                    {...field}
                                // onChange={(e)=> handleImage(e,field.onChange)}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="comment-form_btn">Comment</Button>

            </form>
        </Form>



    </>
    )
}

export default Comments