const apiKey = "577457b685ad2bf6bc5af4cf5ebbfb4f";

/* FULL DISTRICT + TALUK DATA */
const districts = {
  "Bagalkot": ["Badami","Bagalkot","Bilgi","Hungund","Jamkhandi","Mudhol"],
  "Ballari": ["Ballari","Hadagalli","Hagaribommanahalli","Hospet","Kudligi","Sandur","Siruguppa"],
  "Belagavi": ["Athani","Bailhongal","Belagavi","Chikodi","Gokak","Hukkeri","Khanapur","Raibag","Ramdurg","Saundatti"],
  "Bengaluru Urban": ["Anekal","Bangalore North","Bangalore South","Yelahanka"],
  "Bengaluru Rural": ["Devanahalli","Doddaballapur","Hoskote","Nelamangala"],
  "Bidar": ["Aurad","Basavakalyan","Bhalki","Bidar","Humnabad"],
  "Chamarajanagar": ["Chamarajanagar","Gundlupet","Kollegal","Yelandur"],
  "Chikkaballapur": ["Bagepalli","Chikkaballapur","Chintamani","Gauribidanur","Sidlaghatta"],
  "Chikkamagaluru": ["Chikkamagaluru","Kadur","Koppa","Mudigere","Narasimharajapura","Sringeri","Tarikere"],
  "Chitradurga": ["Challakere","Chitradurga","Hiriyur","Holalkere","Hosadurga","Molakalmuru"],
  "Dakshina Kannada": ["Bantwal","Belthangady","Mangaluru","Puttur","Sullia"],
  "Davanagere": ["Channagiri","Davanagere","Harihar","Harapanahalli","Honnali","Jagalur"],
  "Dharwad": ["Dharwad","Hubli","Kalghatgi","Kundgol","Navalgund"],
  "Gadag": ["Gadag","Mundargi","Nargund","Ron","Shirahatti"],
  "Hassan": ["Alur","Arsikere","Belur","Channarayapatna","Hassan","Holenarasipura","Sakleshpur"],
  "Haveri": ["Byadgi","Hangal","Haveri","Hirekerur","Ranebennur","Savanur","Shiggaon"],
  "Kalaburagi": ["Afzalpur","Aland","Chincholi","Chittapur","Kalaburagi","Sedam","Jewargi"],
  "Kodagu": ["Madikeri","Somwarpet","Virajpet"],
  "Kolar": ["Bangarapet","Kolar","Malur","Mulbagal","Srinivaspur"],
  "Koppal": ["Gangavathi","Koppal","Kushtagi","Yelburga"],
  "Mandya": ["Krishnarajpet","Maddur","Malavalli","Mandya","Nagamangala","Pandavapura","Srirangapatna"],
  "Mysuru": ["Hunsur","Krishnarajanagar","Mysuru","Nanjangud","Piriyapatna","T Narasipura"],
  "Raichur": ["Devadurga","Lingasugur","Manvi","Raichur","Sindhanur"],
  "Ramanagara": ["Channapatna","Kanakapura","Magadi","Ramanagara"],
  "Shivamogga": ["Bhadravathi","Hosanagara","Sagar","Shikaripura","Shivamogga","Soraba","Thirthahalli"],
  "Tumakuru": ["Chikkanayakanahalli","Gubbi","Kunigal","Madhugiri","Pavagada","Sira","Tiptur","Tumakuru","Turuvekere"],
  "Udupi": ["Brahmavar","Karkala","Kundapura","Udupi"],
  "Uttara Kannada": ["Ankola","Bhatkal","Haliyal","Honnavar","Joida","Karwar","Kumta","Mundgod","Siddapur","Sirsi","Yellapur"],
  "Vijayapura": ["Basavana Bagewadi","Indi","Muddebihal","Sindagi","Vijayapura"],
  "Yadgir": ["Gurmitkal","Shahapur","Shorapur","Yadgir"]
};

/* LOAD DISTRICTS */
window.onload = () => {
  const districtSelect = document.getElementById("district");

  Object.keys(districts).forEach(d => {
    const option = document.createElement("option");
    option.value = d;
    option.textContent = d;
    districtSelect.appendChild(option);
  });
};

/* UPDATE TALUKS */
function updateTaluks() {
  const district = document.getElementById("district").value;
  const talukSelect = document.getElementById("taluk");

  talukSelect.innerHTML = `<option value="">Select Taluk</option>`;

  if (district) {
    districts[district].forEach(t => {
      const option = document.createElement("option");
      option.value = t;
      option.textContent = t;
      talukSelect.appendChild(option);
    });

    talukSelect.classList.add("pop");
    setTimeout(() => talukSelect.classList.remove("pop"), 300);
  }
}

/* GET WEATHER */
async function getWeather() {
  const taluk = document.getElementById("taluk").value;
  const box = document.getElementById("weatherBox");

  if (!taluk) {
    alert("Select taluk");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${taluk},Karnataka,IN&appid=${apiKey}&units=metric`;

  try {
    box.classList.remove("show");

    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      alert("Weather not available for this taluk, try another");
      return;
    }

    document.getElementById("location").innerText = taluk;
    document.getElementById("temp").innerText = `🌡️ ${data.main.temp}°C`;
    document.getElementById("condition").innerText = `☁️ ${data.weather[0].main}`;
    document.getElementById("humidity").innerText = `💧 ${data.main.humidity}%`;
    document.getElementById("wind").innerText = `🌬️ ${data.wind.speed} m/s`;

    setTimeout(() => box.classList.add("show"), 100);

  } catch {
    alert("Error fetching weather");
  }
}
