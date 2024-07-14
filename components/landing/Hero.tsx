import {Button, buttonVariants} from "@/components/ui/button";
import {HeroCards} from "@/components/landing/HeroCards";

export const Hero = () => {
    return (
        <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
            <div className="text-center lg:text-start space-y-6">
                <main className="text-5xl md:text-6xl font-bold">
                    <h1 className="inline">
                        <span className="inline bg-gradient-to-r from-[#0569f3] via-[#1fc0f1] to-[#0569f3] text-transparent bg-clip-text">
                          Transform
                        </span>{" "}
                        your business with
                    </h1>{" "}
                    <h2 className="inline">
                        <span className="inline bg-gradient-to-r from-[#0569f3] via-[#1fc0f1] to-[#0569f3] text-transparent bg-clip-text">
                          Ring
                        </span>{" "}
                        business management tools
                    </h2>
                </main>

                <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
                    The ultimate platform to manage your sales, inventory, and profits effortlessly
                </p>

                <div className="space-y-4 md:space-y-0 md:space-x-4">
                    <a
                        rel="noreferrer noopener"
                        href="/sign-up"
                        target="_blank"
                        className={`w-full md:w-1/3 ${buttonVariants({
                            variant: "default",
                        })}`}>
                        Get Started
                    </a>
                </div>
            </div>

            {/* Hero cards sections */}
            <div className="z-10">
                <HeroCards />
            </div>

            {/* Shadow effect */}
            <div className="shadow"></div>
        </section>
    );
};