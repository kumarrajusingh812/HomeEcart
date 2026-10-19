// HomeEcart starter demo. Prices are examples; replace them with your real prices.
const WHATSAPP_NUMBER = "7870599000"; // Change this to your store's WhatsApp number, country code included if needed.

const products = [
  {id:1,name:"आटा",unit:"5 KG",category:"आटा और अनाज",emoji:"🌾",retail:180,wholesale:165},
  {id:2,name:"चावल",unit:"5 KG",category:"आटा और अनाज",emoji:"🍚",retail:320,wholesale:295},
  {id:3,name:"अरहर दाल",unit:"1 KG",category:"दालें",emoji:"🫘",retail:145,wholesale:132},
  {id:4,name:"चना दाल",unit:"1 KG",category:"दालें",emoji:"🟡",retail:95,wholesale:86},
  {id:5,name:"सरसों तेल",unit:"1 L",category:"तेल और मसाले",emoji:"🫗",retail:160,wholesale:148},
  {id:6,name:"नमक",unit:"1 KG",category:"तेल और मसाले",emoji:"🧂",retail:25,wholesale:21},
  {id:7,name:"चीनी",unit:"1 KG",category:"दैनिक जरूरत",emoji:"🍬",retail:48,wholesale:43},
  {id:8,name:"चाय पत्ती",unit:"250 G",category:"दैनिक जरूरत",emoji:"🍵",retail:95,wholesale:85},
  {id:9,name:"बेसन",unit:"1 KG",category:"आटा और अनाज",emoji:"🟨",retail:90,wholesale:80},
  {id:10,name:"साबुन",unit:"1 पीस",category:"घर और सफाई",emoji:"🧼",retail:35,wholesale:29},
  {id:11,name:"बिस्कुट",unit:"1 पैकेट",category:"स्नैक्स",emoji:"🍪",retail:20,wholesale:16},
  {id:12,name:"डिटर्जेंट",unit:"1 KG",category:"घर और सफाई",emoji:"🧺",retail:110,wholesale:98}
];
const categories = ["सभी सामान", ...new Set(products.map(p=>p.category))];
let selectedCategory = "सभी सामान";
let cart = {};
let toastTimer;
const $ = id => document.getElementById(id);
const money = n => "₹" + Number(n).toLocaleString("en-IN");
const customerType = () => $("customerType").value;
const priceFor = p => p[customerType()];

function showToast(message){
  const toast=$("toast"); toast.textContent=message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);
}
function renderCategories(){
  $("categoryList").innerHTML = categories.map(c=>`<button type="button" class="category-btn ${c===selectedCategory?"active":""}" data-category="${c}">${c}</button>`).join("");
  $("categoryList").querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{
    selectedCategory=btn.dataset.category; renderCategories(); renderProducts();
  }));
}
function renderProducts(){
  const query=$("searchInput").value.trim().toLowerCase();
  const filtered=products.filter(p=>(selectedCategory==="सभी सामान"||p.category===selectedCategory)&&(`${p.name} ${p.category} ${p.unit}`.toLowerCase().includes(query)));
  $("productTitle").textContent=selectedCategory==="सभी सामान"?"लोकप्रिय सामान":selectedCategory;
  $("resultCount").textContent=`${filtered.length} सामान`;
  $("productGrid").innerHTML=filtered.length?filtered.map(p=>`
    <article class="product-card">
      <div class="product-image" role="img" aria-label="${p.name}">${p.emoji}</div>
      <div class="product-category">${p.category}</div>
      <h3>${p.name}</h3><div class="product-unit">${p.unit}</div>
      <div class="price-row"><span class="price">${money(priceFor(p))}</span>${customerType()==="wholesale"?'<span class="old-price">'+money(p.retail)+'</span>':""}</div>
      <button type="button" class="add-button" data-add="${p.id}">＋ कार्ट में जोड़ें</button>
    </article>`).join(""):'<p class="empty-cart">इस खोज में कोई सामान नहीं मिला।</p>';
  $("productGrid").querySelectorAll("[data-add]").forEach(btn=>btn.addEventListener("click",()=>{
    const id=Number(btn.dataset.add);cart[id]=(cart[id]||0)+1;renderCart();showToast("सामान कार्ट में जोड़ दिया गया");
  }));
}
function renderCart(){
  const ids=Object.keys(cart).filter(id=>cart[id]>0);
  const count=ids.reduce((s,id)=>s+cart[id],0);
  $("cartCount").textContent=count;
  if(!ids.length){$("cartItems").innerHTML='<p class="empty-cart">आपका कार्ट अभी खाली है। सामान जोड़ने के लिए ऊपर जाएँ।</p>';$("cartTotal").textContent=money(0);return;}
  $("cartItems").innerHTML=ids.map(id=>{
    const p=products.find(x=>x.id===Number(id)),qty=cart[id];
    return `<div class="cart-row"><div class="cart-product"><span class="cart-emoji">${p.emoji}</span><div><strong>${p.name}</strong><small>${p.unit} · ${money(priceFor(p))} प्रति यूनिट</small></div></div><div class="quantity"><button type="button" data-change="${id}" data-delta="-1" aria-label="कम करें">−</button><b>${qty}</b><button type="button" data-change="${id}" data-delta="1" aria-label="बढ़ाएँ">＋</button></div><div class="line-price">${money(priceFor(p)*qty)}</div></div>`;
  }).join("");
  $("cartItems").querySelectorAll("[data-change]").forEach(btn=>btn.addEventListener("click",()=>{
    const id=Number(btn.dataset.change);cart[id]+=Number(btn.dataset.delta);if(cart[id]<=0)delete cart[id];renderCart();
  }));
  $("cartTotal").textContent=money(ids.reduce((sum,id)=>sum+priceFor(products.find(p=>p.id===Number(id)))*cart[id],0));
}
$("searchInput").addEventListener("input",renderProducts);
$("customerType").addEventListener("change",()=>{renderProducts();renderCart();});
$("clearCart").addEventListener("click",()=>{cart={};renderCart();showToast("कार्ट खाली कर दिया गया");});
$("cartJump").addEventListener("click",()=>$("cartSection").scrollIntoView({behavior:"smooth"}));
$("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const ids=Object.keys(cart).filter(id=>cart[id]>0);
  if(!ids.length){showToast("पहले कार्ट में सामान जोड़ें");$("products").scrollIntoView({behavior:"smooth"});return;}
  const form=new FormData(e.currentTarget);
  const name=String(form.get("name")).trim(),phone=String(form.get("phone")).trim(),address=String(form.get("address")).trim(),payment=String(form.get("payment"));
  const lines=ids.map(id=>{const p=products.find(x=>x.id===Number(id));return `• ${p.name} (${p.unit}) × ${cart[id]} = ${money(priceFor(p)*cart[id])}`;});
  const total=ids.reduce((sum,id)=>sum+priceFor(products.find(p=>p.id===Number(id)))*cart[id],0);
  const type=customerType()==="wholesale"?"दुकानदार / होलसेल डेमो":"आम ग्राहक / रिटेल";
  const message=`*HomeEcart ऑर्डर अनुरोध*%0Aग्राहक: ${encodeURIComponent(name)}%0Aमोबाइल: ${encodeURIComponent(phone)}%0Aप्रकार: ${encodeURIComponent(type)}%0Aपता: ${encodeURIComponent(address)}%0A%0Aसामान:%0A${encodeURIComponent(lines.join("\n"))}%0A%0Aकुल (डिलीवरी चार्ज से पहले): ${encodeURIComponent(money(total))}%0Aपेमेंट: ${encodeURIComponent(payment)}%0A%0Aकृपया ऑर्डर और अंतिम कीमत की पुष्टि करें।`;
  const cleanNumber=WHATSAPP_NUMBER.replace(/\D/g,"");
  if(!cleanNumber||cleanNumber.length<10){showToast("app.js में सही WhatsApp नंबर डालें");return;}
  window.open(`https://wa.me/${cleanNumber}?text=${message}`,"_blank","noopener");
});
renderCategories();renderProducts();renderCart();
