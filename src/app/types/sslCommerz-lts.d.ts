// declare module "sslcommerz-lts" {
//   export default class SSLCommerzPayment {
//     constructor(storeId: string, storePass: string, isLive: boolean);
//     init(data: Record<string, any>): Promise<any>;
//     validate(data: Record<string, any>): Promise<any>;
//   }
// }
declare module 'sslcommerz-lts' {
    interface InitData {
        store_id: string;
        store_passwd: string;
        total_amount: number;
        currency: string;
        tran_id: string;
        success_url: string;
        fail_url: string;
        cancel_url: string;
        ipn_url?: string;
        cus_name: string;
        cus_email: string;
        cus_add1?: string | null;
        cus_phone: string;
        shipping_method: string;
        product_name: string;
        product_category: string;
        product_profile: string;
        [key: string]: any;
    }

    interface ValidateData {
        val_id: string;
    }

    class SSLCommerzPayment {
        constructor(storeId: string, storePass: string, isLive: boolean);
        init(data: InitData): Promise<any>;
        validate(data: ValidateData): Promise<any>;
    }

    export = SSLCommerzPayment;
}