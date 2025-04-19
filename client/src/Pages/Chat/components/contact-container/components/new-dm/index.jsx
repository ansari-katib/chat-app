import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import apiClient from "@/lib/api-client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST, SEARCH_CONTACTS_ROUTE } from "@/utils/constant";
import { useAppStore } from "@/Store";


function NewDm() {
    const { setSelectedChatType, setSelectedChatData } = useAppStore();

    const [openNewContactModel, setOpenNewContactModel] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);
    // console.log("the state data : ",searchedContacts);

    const searchContact = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const response = await apiClient.post(
                    SEARCH_CONTACTS_ROUTE,
                    { searchTerm },
                    { withCredentials: true }
                )
                // console.log(response.data.contacts);
                if (response.status === 200 && response.data.contacts) {
                    setSearchedContacts(response.data.contacts);
                } else {
                    setSearchedContacts([]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    const selectNewContact = (contact) => {

        setOpenNewContactModel(false);
        setSelectedChatType("contact");
        setSelectedChatData(contact);
        setSearchedContacts([]);

    }


    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-neutral-400 opacity-90 font-light text-sm hover:text-neutral-100 cursor-pointer transition-all duration-300"
                            onClick={() => setOpenNewContactModel(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent
                        className="bg-[#1c1b1e] border-none mb-2 p-3 text-white"
                    > select new contact </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <Dialog
                open={openNewContactModel}
                onOpenChange={setOpenNewContactModel}
            >
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col " >
                    <DialogHeader>
                        <DialogTitle>
                            please select a contact
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="search contact"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={(event) => searchContact(event.target.value)}
                        />
                    </div>

                    {
                        searchedContacts.length > 0 && (
                            <ScrollArea className="h-[250px]" >
                                <div className=" flex flex-col gap-5">
                                    {
                                        searchedContacts.map((contact) => (
                                            <div
                                                key={contact._id}
                                                className="flex gap-3 items-center cursor-pointer"
                                                onClick={() => { selectNewContact(contact) }}
                                            >
                                                <div className='w-12 h-12 relative' >
                                                    <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                                                        {contact.image ? (
                                                            <AvatarImage
                                                                src={`${HOST}/${contact.image}`}
                                                                alt='profile'
                                                                className='object-cover w-full h-full bg-black'
                                                            />
                                                        ) : (
                                                            <div className={`uppercase h-12 w-12 text-2xl border-[1px] flex justify-center items-center rounded-full ${getColor(contact.color)}`} >
                                                                {
                                                                    contact.firstName
                                                                        ? contact.firstName.split("").shift()
                                                                        : contact.email.split("").shift()
                                                                }
                                                            </div>
                                                        )}
                                                    </Avatar>
                                                </div>
                                                <div className="flex flex-col" >
                                                    <span>
                                                        {
                                                            contact.firstName && contact.lastName
                                                                ? `${contact.firstName} ${contact.lastName}`
                                                                : contact.email
                                                        }
                                                    </span>
                                                    <span className="text-xs" >
                                                        {contact.email}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </ScrollArea>
                        )
                    }

                    {
                        searchedContacts.length <= 0 &&
                        (
                            <div className='flex-1 md:flex flex-col justify-center items-center  duration-1000 transition-all' >
                                <Lottie
                                    isClickToPauseDisabled={true}
                                    height={100}
                                    width={100}
                                    options={animationDefaultOptions}
                                />
                                <div className="text-opacity-80 text-white flex flex-col items-center gap-5 mt-10 lg:text-2xl text-xl transition-all duration-300 text-center ">
                                    <h3 className="poppins-medium" >
                                        Hi<span className="text-purple-500">!</span> Search new
                                        <span className="text-purple-500" > Contact.</span>
                                    </h3>

                                </div>
                            </div>
                        )
                    }
                </DialogContent>
            </Dialog>


        </>
    )
}

export default NewDm
