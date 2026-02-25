// type Props = {
//   name: string;
//   imageUrl: string;
// };

// export default function FoodCard({ name, imageUrl }: Props) {
//   return (
//     <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
//       <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
//         <img
//           src={imageUrl}
//           alt={name}
//           className="h-full w-full object-cover"
//           loading="lazy"
//         />
//       </div>
//       <div className="p-4">
//         <div className="text-base font-semibold text-slate-900">{name}</div>
//       </div>
//     </div>
//   );
// }
type Props = {
  name: string;
  imageUrl: string;
};

export default function FoodCard({ name, imageUrl }: Props) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-white/55 bg-white/60 backdrop-blur shadow-[0_18px_46px_-32px_rgba(15,23,42,0.5),0_14px_28px_-24px_rgba(249,115,22,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_30px_70px_-40px_rgba(15,23,42,0.6),0_22px_44px_-30px_rgba(249,115,22,0.38)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-white">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(255,153,0,0.35),transparent_60%)] blur-2xl" />
          <div className="absolute -right-12 -bottom-14 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9),transparent_60%)] blur-2xl" />
        </div>

        <img
          src={imageUrl}
          alt={name}
          className="relative h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <div className="text-base font-semibold text-slate-900">{name}</div>
      </div>
    </div>
  );
}