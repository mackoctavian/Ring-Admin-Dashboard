import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {buttonVariants} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Check, TabletSmartphoneIcon} from "lucide-react";

export const HeroCards = () => {
    return (
        <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
            {/* Testimonial */}
            <Card className="absolute w-[340px] -top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar>
                        <AvatarImage alt="Mohammed Awami" src="https://github.com/shadcn.png"/>
                        <AvatarFallback>AK</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                        <CardTitle className="text-lg">Anthony Kabaka</CardTitle>
                        <CardDescription>@akabaka</CardDescription>
                    </div>
                </CardHeader>

                <CardContent>Ring revolutionized our business operations, making everything seamless and efficient!</CardContent>
            </Card>

            {/* Team */}
            <Card className="absolute right-[20px] top-4 w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar>
                        <AvatarImage alt="Peter Karanja" src="https://i.pravatar.cc/150?img=58"/>
                        <AvatarFallback>PK</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                        <CardTitle className="text-lg">Peter Karanja</CardTitle>
                        <CardDescription>@pittskay</CardDescription>
                    </div>
                </CardHeader>

                <CardContent>With Ring, our sales have skyrocketed, and manual processes are a thing of the past!</CardContent>
            </Card>

            {/* Pricing */}
            <Card className="absolute top-[190px] left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
                <CardHeader>
                    <CardTitle className="flex item-center justify-between">
                        Premium
                        <Badge variant="secondary" className="text-sm text-primary">
                            Most popular
                        </Badge>
                    </CardTitle>
                    <div>
                        <span className="text-3xl font-bold">$49.99</span>
                        <span className="text-muted-foreground"> /month</span>
                    </div>

                    <CardDescription>
                        Empower your business with the tools you need to thrive.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <a
                        rel="noreferrer noopener"
                        href="/sign-up"
                        target="_blank"
                        className={`w-full ${buttonVariants({
                            variant: "default",
                        })}`}>
                        Start Free Trial
                    </a>
                </CardContent>

                <hr className="w-4/5 m-auto mb-4"/>

                <CardFooter className="flex">
                    <div className="space-y-4">
                        {["Manage unlimited branches", "Unlimited products & services", "20 users included"].map(
                            (benefit: string) => (
                                <span key={benefit} className="flex">
                                    <Check className="text-green-500" />{" "}
                                    <p className="ml-2">{benefit}</p>
                                </span>
                            )
                        )}
                    </div>
                </CardFooter>
            </Card>

            {/* Service */}
            <Card className="absolute w-[350px] -right-[10px] bottom-[60px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                    <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                        <TabletSmartphoneIcon />
                    </div>
                    <div>
                        <CardTitle>Free mobile POS app</CardTitle>
                        <CardDescription className="text-md mt-2">
                            Simplify your sales with our free, user-friendly Point of Sale app. Manage transactions, track inventory, and gain insights on the go.
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
};