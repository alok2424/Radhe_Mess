type Props = {
  name: string;
  imageUrl: string;
};

export default function FoodCard({ name, imageUrl }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="text-base font-semibold text-slate-900">{name}</div>
      </div>
    </div>
  );
}
