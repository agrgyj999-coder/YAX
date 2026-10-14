const products = [
 {id:1,name:"آیس آمریکانو",desc:"قهوه اسپرسو با آب یخ",price:75000,cat:"cold",img:"photo-1517701604599-bb29b565090c"},
 {id:2,name:"لاته",desc:"اسپرسو + شیر بخار داده شده",price:80000,cat:"coffee",img:"photo-1461023058943-07fcbe16d735"},
 {id:3,name:"اسپرسو",desc:"قهوه خالص و اصیل",price:60000,cat:"coffee",img:"photo-1510707577719-ae7c14805e3a"},
 {id:4,name:"کاپوچینو",desc:"اسپرسو + شیر + فوم شیر",price:75000,cat:"coffee",img:"photo-1572442388796-11668a67e53d"},
 {id:5,name:"موهیتو توت‌فرنگی",desc:"تازه و خنک",price:70000,cat:"cold",img:"photo-1513558161293-c201c4e8bee1"},
 {id:6,name:"ماچا لاته",desc:"چای سبز + شیر",price:85000,cat:"cold",img:"photo-1515823064-d6e0c04616a7"},
 {id:7,name:"آیس لاته",desc:"اسپرسو + شیر + یخ",price:75000,cat:"cold",img:"photo-1461023058943-07fcbe16d735"},
 {id:8,name:"هات چاکلت",desc:"شکلات داغ با خامه",price:70000,cat:"coffee",img:"photo-1542990253-0b8be7d2b6b0"},
 {id:9,name:"ساندویچ مرغ",desc:"نان تست + مرغ + سبزیجات",price:120000,cat:"food",img:"photo-1528735602780-2552fd46c7af"},
 {id:10,name:"تست آووکادو",desc:"نان تست + آووکادو + تخم مرغ",price:110000,cat:"food",img:"photo-1525351484163-7529414344d8"},
 {id:11,name:"چیز کیک",desc:"کیک خامه‌ای با طعم خاص",price:85000,cat:"dessert",img:"photo-1533134242443-d4fd215305ad"},
 {id:12,name:"کیک شکلاتی",desc:"کیک شکلاتی کلاسیک",price:75000,cat:"dessert",img:"photo-1578985545062-69928b1d9587"}
];
const imageUrl = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;
const money = n => n.toLocaleString("fa-IR") + " تومان";
let cart = JSON.parse(localStorage.getItem("yax-cart") || "{}");
let activeCategory = "all";
const grid = document.getElementById("product-grid");
function renderProducts(){
 const list = activeCategory === "all" ? products : products.filter(p=>p.cat===activeCategory);
 grid.innerHTML = list.map(p=>`<article class="product-card"><div class="product-photo" style="background-image:url('${imageUrl(p.img)}')"></div><div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><div class="price">${money(p.price)}</div><button class="add-btn" data-add="${p.id}">افزودن به سبد خرید　🛒</button></div></article>`).join("");
}
function renderCart(){
 const entries = Object.entries(cart).filter(([id,q])=>q>0);
 document.getElementById("cart-count").textContent = entries.reduce((s,[id,q])=>s+q,0).toLocaleString("fa-IR");
 document.getElementById("cart-items").innerHTML = entries.length ? entries.map(([id,q])=>{const p=products.find(x=>x.id===+id);return `<div class="cart-item"><div class="cart-thumb" style="background-image:url('${imageUrl(p.img)}')"></div><div><h4>${p.name}</h4><small>${money(p.price)}</small><div class="cart-controls"><button data-minus="${id}">−</button><span>${q.toLocaleString("fa-IR")}</span><button data-plus="${id}">+</button><button data-remove="${id}" aria-label="حذف">×</button></div></div></div>`}).join("") : '<p class="empty">سبد خرید شما خالی است.</p>';
 const total=entries.reduce((s,[id,q])=>s+products.find(p=>p.id===+id).price*q,0);
 document.getElementById("cart-total").textContent=money(total);
 localStorage.setItem("yax-cart",JSON.stringify(cart));
}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),3000)}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]"); if(add){const id=add.dataset.add;cart[id]=(cart[id]||0)+1;renderCart();toast("به سبد خرید اضافه شد.");}
 const plus=e.target.closest("[data-plus]");if(plus){const id=plus.dataset.plus;cart[id]=(cart[id]||0)+1;renderCart();}
 const minus=e.target.closest("[data-minus]");if(minus){const id=minus.dataset.minus;cart[id]--;if(cart[id]<=0)delete cart[id];renderCart();}
 const remove=e.target.closest("[data-remove]");if(remove){delete cart[remove.dataset.remove];renderCart();}
 const filter=e.target.closest("[data-category]");if(filter){activeCategory=filter.dataset.category;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("selected",b===filter));renderProducts();}
});
document.getElementById("jump-cart").addEventListener("click",()=>document.getElementById("cart-panel").scrollIntoView({behavior:"smooth"}));
const modal=document.getElementById("modal");
document.getElementById("checkout").addEventListener("click",()=>{if(!Object.values(cart).some(q=>q>0)){toast("ابتدا محصولی به سبد خرید اضافه کنید.");return;}modal.hidden=false;});
document.getElementById("close-modal").addEventListener("click",()=>modal.hidden=true);
modal.addEventListener("click",e=>{if(e.target===modal)modal.hidden=true;});
document.getElementById("confirm-order").addEventListener("click",()=>{
 const name=document.getElementById("customer-name").value.trim();
 const phone=document.getElementById("customer-phone").value.trim();
 if(!name||!phone){toast("لطفاً نام و شماره موبایل را وارد کنید.");return;}
 const lines=Object.entries(cart).filter(([id,q])=>q>0).map(([id,q])=>{const p=products.find(x=>x.id===+id);return `• ${p.name} × ${q} — ${money(p.price*q)}`});
 const total=Object.entries(cart).reduce((s,[id,q])=>s+products.find(p=>p.id===+id).price*q,0);
 const message=`سفارش آزمایشی کافه YAX\nنام: ${name}\nموبایل: ${phone}\n${lines.join("\n")}\nمبلغ کل: ${money(total)}\n\nاین سفارش از نسخه آزمایشی سایت ساخته شده است.`;
 const url="https://t.me/share/url?url="+encodeURIComponent(location.href)+"&text="+encodeURIComponent(message);
 modal.hidden=true;
 window.open(url,"_blank","noopener");
 toast("پیام سفارش آماده شد؛ در تلگرام مقصد را انتخاب کنید.");
});
document.getElementById("notify-demo").addEventListener("click",async()=>{
 if(!("Notification" in window)){toast("این مرورگر از اعلان پشتیبانی نمی‌کند.");return;}
 if(!window.isSecureContext){toast("برای تست اعلان، سایت را روی HTTPS باز کنید.");return;}
 let permission=Notification.permission;
 if(permission==="default")permission=await Notification.requestPermission();
 if(permission==="granted"){new Notification("کافه YAX",{body:"این یک اعلان آزمایشی است؛ سفارش شما آماده تحویل است! ☕",icon:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=128&q=80"});toast("اعلان آزمایشی ارسال شد.");}
 else toast("اجازه اعلان فعال نشد؛ تنظیمات مرورگر را بررسی کنید.");
});
renderProducts();renderCart();
