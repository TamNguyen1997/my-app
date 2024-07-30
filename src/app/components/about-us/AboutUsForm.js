import { useState } from 'react';
import { UserRound, Mail, Smartphone, Check } from "lucide-react";
import { Input, RadioGroup, Radio, useRadio, VisuallyHidden, Button } from "@nextui-org/react";

const CustomRadio = (props) => {
    const {
        Component,
        children,
        isSelected,
        getBaseProps,
        getWrapperProps,
        getInputProps,
        getLabelProps,
        getLabelWrapperProps,
        getControlProps,
    } = useRadio(props);

    const { oldprice, price } = props;

    return (
        <Component
            {...getBaseProps()}
            className={`
                relative group inline-flex items-center hover:opacity-70 active:opacity-50 tap-highlight-transparent
                cursor-pointer rounded-lg gap-4 p-2.5 pl-1
                data-[selected=true]:bg-[#2f1f96]
                bg-[#f3f3f4]
                ${isSelected && 'border-primary'}
            `}
        >
            <VisuallyHidden>
                <input {...getInputProps()} />
            </VisuallyHidden>
            <span {...getWrapperProps()} style={{
                position: 'absolute',
                right: '10px',
                top: '12px',
                borderColor: isSelected ? "white" : "#7f7f7f"
            }}>
                {/* <span {...getControlProps()} /> */}
                <Check size="16" {...getControlProps()} style={{ background: 'transparent', scale: "2" }} />
            </span>
            <div {...getLabelWrapperProps()} style={{ width: '100%' }}>
                {children && <span {...getLabelProps()} className={`
                    text-sm font-semibold mb-3
                    ${isSelected ? 'text-white' : 'text-[#9e9e9e]'}
                `}>{children}</span>}
                <div className="flex items-center w-full">
                    {oldprice && (
                        <span className={`
                            text-sm line-through mr-2
                            ${isSelected ? 'text-white': 'text-[#929292]'}    
                        `}>Rp{oldprice}</span>
                    )}
                    {price && (
                        <span className={`
                            text-xl font-semibold ml-auto
                            ${isSelected ? 'text-[#eb5757]' : 'text-[#f5adad]'}
                        `}>Rp{price}</span>
                    )}
                </div>
            </div>
        </Component>
    );
};

const AboutUsForm = () => {
    const features = [
        "Akun ELSA Pro dapat akses tak terbatas ke semua fitur.",
        "Memprediksi Skor IELTS Speaking Anda Secara Akurat.",
        "Belajar 24/7 kapan saja, di mana saja.",
        "Laporan perkembangan harian.",
        "95% berkomunikasi bahasa Inggris dengan lebih baik setelah 3 bulan.",
    ];

    const [condition, setCondition] = useState({});

    const onConditionChange = (value) => {
        setCondition(Object.assign({}, condition, value))
    }

    return (
        <div className="container pt-[30px] pb-[60px]">
            <div className="grid md:grid-cols-[5fr_7fr] grid-cols-1 gap-5">
                <div>
                    <h2
                        className="text-3xl font-semibold text-center bg-[linear-gradient(0deg,#fd4aa9_0%,#ff926e_98.75%)] bg-clip-text mb-5"
                        style={{ WebkitTextFillColor: 'rgba(0,0,0,0)' }}
                    >
                        MEGA SALE!!! <br /> Set lengkap ELSA Pro 2024
                    </h2>
                    <img
                        width="350"
                        height="225"
                        src="https://id.elsaspeak.com/wp-content/themes/elsawebsite/partials/form-order/images/bg-order.png"
                        alt=""
                        className="mx-auto"
                    />
                    <div className="my-5">
                        {
                            features?.map((feature, index) => {
                                return <div
                                    key={index}
                                    className="flex items-center space-x-2 mb-2"
                                >
                                    <img width="15" height="14" src="/icon/star.svg" alt="" />
                                    <p className="text-sm">{feature}</p>
                                </div>
                            })
                        }
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl leading-relaxed font-semibold mb-3">
                        Belajar bahasa inggris secara langsung dengan tutor AI <br /> bersama dengan 13,000,000 siswa di seluruh dunia.
                    </h2>
                    <Input label="" placeholder="Tên" aria-label="Tên" labelPlacement="outside" defaultValue={condition.name}
                        isClearable
                        startContent={<UserRound size="20" />}
                        className={`
                            [&_[data-slot=input-wrapper]]:rounded-md
                            [&_[data-slot=input-wrapper]]:border
                            [&_[data-slot=input-wrapper]]:border-[rgba(18,17,49,.3)]
                            [&_[data-slot=input-wrapper]]:bg-white
                            [&_[data-slot=input-wrapper]]:shadow-none
                            mb-4
                        `}
                        onValueChange={(value) => {
                            if (value.length > 2 || value.length === 0) onConditionChange({ name: value })
                        }}
                    />
                    <Input label="" placeholder="Email" aria-label="email" labelPlacement="outside" defaultValue={condition.slug}
                        isClearable
                        startContent={<Mail size="20" />}
                        className={`
                            [&_[data-slot=input-wrapper]]:rounded-md
                            [&_[data-slot=input-wrapper]]:border
                            [&_[data-slot=input-wrapper]]:border-[rgba(18,17,49,.3)]
                            [&_[data-slot=input-wrapper]]:bg-white
                            [&_[data-slot=input-wrapper]]:shadow-none
                            mb-4
                        `}
                        onValueChange={(value) => {
                            if (value.length > 2 || value.length === 0) onConditionChange({ email: value })
                        }}
                    />
                    <Input label="" placeholder="Số điện thoại" aria-label="phone" labelPlacement="outside" defaultValue={condition.slug}
                        isClearable
                        startContent={<Smartphone size="20" />}
                        className={`
                            [&_[data-slot=input-wrapper]]:rounded-md
                            [&_[data-slot=input-wrapper]]:border
                            [&_[data-slot=input-wrapper]]:border-[rgba(18,17,49,.3)]
                            [&_[data-slot=input-wrapper]]:bg-white
                            [&_[data-slot=input-wrapper]]:shadow-none
                            mb-4
                        `}
                        onValueChange={(value) => {
                            if (value.length > 2 || value.length === 0) onConditionChange({ phone: value })
                        }}
                    />

                    <RadioGroup
                        className={`
                            [&>div]:grid
                            [&>div]:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]
                            [&>div]:gap-x-7
                            [&>div]:gap-y-4
                            mb-2
                        `}
                    >
                        <CustomRadio oldprice="799.000" price="559.000" value="value_1">
                            ELSA Pro 1 tahun
                        </CustomRadio>
                        <CustomRadio oldprice="7.190.000" price="1.019.000" value="value_2">
                            ELSA Pro selamanya
                        </CustomRadio>
                    </RadioGroup>

                    <Button className="w-full rounded-lg text-lg font-semibold text-white h-[50px] bg-[linear-gradient(180deg,#29f4ff_-46.11%,#5257ff_151.97%)]">KIRIM</Button>
                </div>
            </div>
        </div>
    )
};

export default AboutUsForm;