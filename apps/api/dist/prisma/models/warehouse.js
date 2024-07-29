"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listWarehouse = listWarehouse;
function listWarehouse() {
    return __awaiter(this, void 0, void 0, function* () {
        return [
            {
                id: '8b7398bc-77d2-4b70-b1d4-a6025d053e92',
                warehouseName: 'Percaya Diri',
                coordinate: 'Jalan Kembang Sapatu, Karees Sapuran, Kacapiring, Batununggal, Bandung, Indonesia, Kota Bandung, Jawa Barat, Indonesia',
                address: 'Jalan Kembang Sapatu, Karees Sapuran, Kacapiring, Batununggal, Bandung, Indonesia',
                city_id: '23',
                province_id: '9',
                province: 'Jawa Barat',
                type: 'Kota',
                city_name: 'Bandung',
                postal_code: '40111',
                createdAt: new Date('2024-07-06T16:09:05.278Z'),
                adminID: null,
                isActive: true
            },
            {
                id: '05b7022b-22f3-467e-ab7e-0acc8106e594',
                warehouseName: 'Paling Kiri',
                coordinate: 'Simpang Tiga, Kabupaten Aceh Besar, Nanggroe Aceh Darussalam (NAD), Indonesia',
                address: 'Simpang Tiga',
                city_id: '3',
                province_id: '21',
                province: 'Nanggroe Aceh Darussalam (NAD)',
                type: 'Kabupaten',
                city_name: 'Aceh Besar',
                postal_code: '23951',
                createdAt: new Date('2024-07-07T03:26:39.516Z'),
                adminID: null,
                isActive: true
            },
            {
                id: '555c6453-5414-4ff4-8fbb-2ebb363486c2',
                warehouseName: 'Ampera Jaya',
                coordinate: 'Jalan Pangeran Sidoing Lautan, 29 Ilir, Ilir Barat II, Palembang, Indonesia, Kota Palembang, Sumatera Selatan, Indonesia',
                address: 'Jalan Pangeran Sidoing Lautan, 29 Ilir, Ilir Barat II, Palembang, Indonesia',
                city_id: '327',
                province_id: '33',
                province: 'Sumatera Selatan',
                type: 'Kota',
                city_name: 'Palembang',
                postal_code: '30111',
                createdAt: new Date('2024-07-07T03:33:57.950Z'),
                adminID: null,
                isActive: true
            },
            {
                id: '6e5148ce-262c-4956-9edd-0c0d9609a164',
                warehouseName: 'Paradise Breeze',
                coordinate: 'Jalan Kubu Anyar 28, Kuta - Kabupaten Badung - Bali - Indonesia, Kuta, Kuta, Badung, Indonesia, Kabupaten Badung, Bali, Indonesia',
                address: 'Jalan Kubu Anyar 28, Kuta - Kabupaten Badung - Bali - Indonesia, Kuta, Kuta, Badung, Indonesia',
                city_id: '17',
                province_id: '1',
                province: 'Bali',
                type: 'Kabupaten',
                city_name: 'Badung',
                postal_code: '80351',
                createdAt: new Date('2024-07-07T03:25:29.974Z'),
                adminID: null,
                isActive: true
            },
            {
                id: 'a058dfe6-fa31-4ee1-84e4-c7ed8fcf9f85',
                warehouseName: 'Mantan Ibukota',
                coordinate: 'Jalan Medan Merdeka Selatan 6, Central Jakarta, Gambir, Gambir, Jakarta Pusat, Indonesia, Kota Jakarta Pusat, DKI Jakarta, Indonesia',
                address: 'Jalan Medan Merdeka Selatan 6, Central Jakarta, Gambir, Gambir, Jakarta Pusat, Indonesia',
                city_id: '152',
                province_id: '6',
                province: 'DKI Jakarta',
                type: 'Kota',
                city_name: 'Jakarta Pusat',
                postal_code: '10540',
                createdAt: new Date('2024-07-07T03:28:34.218Z'),
                adminID: null,
                isActive: true
            },
            {
                id: 'acb7c6bd-bdcf-4a07-95e5-8de95e07fcfc',
                warehouseName: 'Jaya Abadi',
                coordinate: 'Jalan Topaz Raya, Panakkukang - Makassar, Masale, Panakkukang, Makassar, 902222, Indonesia, Kota Makassar, Sulawesi Selatan, Indonesia',
                address: 'Jalan Topaz Raya, Panakkukang - Makassar, Masale, Panakkukang, Makassar, 902222, Indonesia',
                city_id: '254',
                province_id: '28',
                province: 'Sulawesi Selatan',
                type: 'Kota',
                city_name: 'Makassar',
                postal_code: '90111',
                createdAt: new Date('2024-07-07T03:31:49.805Z'),
                adminID: null,
                isActive: true
            },
            {
                id: 'd149704e-ddc3-48c4-b046-3967181a75d3',
                warehouseName: 'Markas Dilan',
                coordinate: 'Jalan Asia Afrika 141-149, Bandung - Jawa Barat, Kebon Pisang, Sumur Bandung, Bandung, Indonesia, Kota Bandung, Jawa Barat, Indonesia',
                address: 'Jalan Asia Afrika 141-149, Bandung - Jawa Barat, Kebon Pisang, Sumur Bandung, Bandung, Indonesia',
                city_id: '23',
                province_id: '9',
                province: 'Jawa Barat',
                type: 'Kota',
                city_name: 'Bandung',
                postal_code: '40111',
                createdAt: new Date('2024-07-07T03:32:20.713Z'),
                adminID: null,
                isActive: true
            },
            {
                id: 'd9bfa622-ffda-4f6f-b60a-69ac5ef65884',
                warehouseName: 'Pasar Lumpia',
                coordinate: 'Jalan Perumahan Green Candi, RW 02, Kaliwiru, Candisari, Semarang, Indonesia, Kabupaten Semarang, Jawa Tengah, Indonesia',
                address: 'Jalan Perumahan Green Candi, RW 02, Kaliwiru, Candisari, Semarang, Indonesia',
                city_id: '398',
                province_id: '10',
                province: 'Jawa Tengah',
                type: 'Kabupaten',
                city_name: 'Semarang',
                postal_code: '50511',
                createdAt: new Date('2024-07-07T03:30:17.562Z'),
                adminID: null,
                isActive: true
            },
            {
                id: 'f5004c6b-fa76-4c62-ac1f-df9bcef51b47',
                warehouseName: 'Warna Warni Malang',
                coordinate: 'Gang 2, Sukoharjo, Malang, Indonesia, Kota Malang, Jawa Timur, Indonesia',
                address: 'Gang 2, Sukoharjo, Malang, Indonesia',
                city_id: '256',
                province_id: '11',
                province: 'Jawa Timur',
                type: 'Kota',
                city_name: 'Malang',
                postal_code: '65112',
                createdAt: new Date('2024-07-07T03:34:47.732Z'),
                adminID: null,
                isActive: true
            },
            {
                id: 'f9f2e850-feb7-41ff-a969-924633b65c49',
                warehouseName: 'Agak Laen',
                coordinate: 'Jalan Diponegoro 24, Hamdan, Medan Polonia, Medan, Indonesia, Kota Medan, Sumatera Utara, Indonesia',
                address: 'Jalan Diponegoro 24, Hamdan, Medan Polonia, Medan, Indonesia',
                city_id: '278',
                province_id: '34',
                province: 'Sumatera Utara',
                type: 'Kota',
                city_name: 'Medan',
                postal_code: '20228',
                createdAt: new Date('2024-07-07T03:27:10.881Z'),
                adminID: null,
                isActive: true
            },
            {
                id: 'fd29abfe-67b7-4c29-bfbd-0df0c575e13a',
                warehouseName: 'Hiu dan Buaya',
                coordinate: 'Jalan Genteng Muhammadiyah, Ketabang - Genteng - Surabaya, Genteng, Genteng, Surabaya, Indonesia, Kota Surabaya, Jawa Timur, Indonesia',
                address: 'Jalan Genteng Muhammadiyah, Ketabang - Genteng - Surabaya, Genteng, Genteng, Surabaya, Indonesia',
                city_id: '444',
                province_id: '11',
                province: 'Jawa Timur',
                type: 'Kota',
                city_name: 'Surabaya',
                postal_code: '60119',
                createdAt: new Date('2024-07-07T03:30:51.510Z'),
                adminID: null,
                isActive: true
            }
        ];
    });
}
