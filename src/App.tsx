/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Search, BarChart2, User, Home, X, ChevronRight, Pointer } from 'lucide-react';
import confetti from 'canvas-confetti';
import bibim from './bibim.png';
import salad from './salad81.png';
import tamagotchi from './다마고치.png';
import tamagotchiMagnifier from './다마고치돋보기.png';
import shrimpSnack from './새우깡.png';
import coffee from './coffee.png';
import cola from './cola.png';
import hungrySound from './배고파.mp3';
import allergySound from './알러지.mp3';
import allergyAlertSound from './알러지알림음.mp3';
import ingredientSound from './원재료.mp3';
import latteIngredientSound from './원유많이.mp3';

interface NutritionCard {
  id: number;
  category: string;
  value: string;
  unit: string;
  ratioText: string;
  ratioValue: number;
  detail: string;
  showGauge?: boolean;
  color?: string;
  isWarning?: boolean;
}

interface FoodItem {
  id: string;
  name: string;
  fullName: string;
  image: string;
  kcal?: string;
  sodium?: number;
  ingredients?: string;
  fullIngredients?: string;
  hasAllergy?: boolean;
  nutrition: NutritionCard[];
  detailedNutrition?: {
    label: string;
    value: string;
    ratio?: number;
    color?: string;
  }[];
  diagram: {
    carbo: number;
    protein: number;
    fat: number;
  };
}

const FOOD_DATA: Record<string, FoodItem> = {
  "bibim": {
    id: "bibim",
    name: "정성 가득 비빔밥",
    fullName: "정성 가득 비빔밥 (400g)",
    image: bibim,
    kcal: "590 kcal",
    sodium: 50,
    ingredients: "쌀, 콩나물, 시금치, 당근, 소고기, 고추장, 참기름 등",
    fullIngredients: "쌀(국산), 알가열제품[계란(국산), 변성전분, 식물성유지(대두유:외국산), 덱스트린, 옥수수전분], 소스1[고추장{소맥분(밀:미국산, 호주산)}, 설탕, 물엿, 배농축과즙액{배농축액(배:국산)}, 우육], 유채나물무침[유채, 가공소금, 마늘, 참기름, 복합조미식품{L-글루탐산나트륨(향미증진제)}], 콩나물, 양념육, 당근, 도라지, 과채가공품, 청상추, 대두유, 양파, 참기름1, 소스2, 참기름2, 볶음참깨, 혼합간장, 마늘, 가공소금, 복합조미식품, 정제소금, 정제수 *이 제품은 메밀, 땅콩, 고등어, 게, 새우, 복숭아, 토마토, 아황산류, 호두, 닭고기, 오징어, 조개류(전복, 홍합 포함), 잣을 사용한 제품과 같은 제조시설에서 제조하고 있습니다.",
    hasAllergy: false,
    nutrition: [
      { id: 0, category: "칼로리", value: "590", unit: "kcal", ratioText: "하루 권장량의 30%", ratioValue: 30, detail: "", showGauge: false },
      { id: 1, category: "나트륨", value: "1010", unit: "mg", ratioText: "하루 권장량의 51%", ratioValue: 51, detail: "", showGauge: true, color: "#FF6B6B", isWarning: true },
      { id: 2, category: "탄수화물", value: "115", unit: "g", ratioText: "하루 권장량의 35%", ratioValue: 35, detail: "", showGauge: true },
      { id: 3, category: "당류", value: "10", unit: "g", ratioText: "하루 권장량의 10%", ratioValue: 10, detail: "", showGauge: true },
      { id: 4, category: "지방", value: "8", unit: "g", ratioText: "하루 권장량의 12%", ratioValue: 12, detail: "트랜스지방: 0g\n포화지방: 2.0g (13%)", showGauge: true },
      { id: 5, category: "단백질", value: "15", unit: "g", ratioText: "하루 권장량의 27%", ratioValue: 27, detail: "", showGauge: true }
    ],
    detailedNutrition: [
      { label: "열량", value: "590 kcal" },
      { label: "나트륨", value: "1,010 mg", ratio: 51, color: "#FF6B6B" },
      { label: "탄수화물", value: "115 g", ratio: 35, color: "#000181" },
      { label: "당류", value: "10 g", ratio: 10, color: "#FFD93D" },
      { label: "지방", value: "8.0 g", ratio: 15, color: "#006EE9" },
      { label: "트랜스지방", value: "0 g" },
      { label: "포화지방", value: "2.0 g", ratio: 13, color: "#4D96FF" },
      { label: "콜레스테롤", value: "0 mg", ratio: 0, color: "#A0A0A0" },
      { label: "단백질", value: "14 g", ratio: 25, color: "#E8A0FF" },
    ],
    diagram: { carbo: 78, protein: 10, fat: 12 }
  },
  "salad": {
    id: "salad",
    name: "스모크 닭가슴살 샐러드",
    fullName: "스모크 닭가슴살 샐러드 (140g)",
    image: salad,
    kcal: "82 kcal",
    sodium: 24,
    ingredients: "양상추, 치커리, 방울토마토, 닭가슴살, 오리엔탈 드레싱 등",
    fullIngredients: "양상추(국산), 소스[발효식초(이탈리아산), 설탕, 기타과당, 물엿, 정제소금(국산)], 하림닭가슴살훈제슬라이스[닭가슴살(국산), 혼합제제1(젖산나트륨분말, 초산나트륨분말, 이산화규소), 미림(쌀:외국산), 정제소금, 복합허브추출물SL], 방울토마토, 치커리, 라디치오",
    hasAllergy: true,
    nutrition: [
      { id: 0, category: "칼로리", value: "82", unit: "kcal", ratioText: "하루 권장량의 4%", ratioValue: 4, detail: "", showGauge: false },
      { id: 1, category: "나트륨", value: "480", unit: "mg", ratioText: "하루 권장량의 24%", ratioValue: 24, detail: "", showGauge: true, color: "#FF6B6B", isWarning: true },
      { id: 2, category: "탄수화물", value: "12", unit: "g", ratioText: "하루 권장량의 4%", ratioValue: 4, detail: "식이섬유 풍부: 채소 위주의 건강한 탄수화물입니다.", showGauge: true },
      { id: 3, category: "당류", value: "12", unit: "g", ratioText: "하루 권장량의 12%", ratioValue: 12, detail: "", showGauge: true },
      { id: 4, category: "지방", value: "0.5", unit: "g", ratioText: "하루 권장량의 1%", ratioValue: 1, detail: "트랜스지방: 0.0g\n포화지방: 0.2g (1%)", showGauge: true },
      { id: 5, category: "단백질", value: "7", unit: "g", ratioText: "하루 권장량의 13%", ratioValue: 13, detail: "", showGauge: true }
    ],
    detailedNutrition: [
      { label: "열량", value: "82 kcal" },
      { label: "나트륨", value: "480 mg", ratio: 24, color: "#FF6B6B" },
      { label: "탄수화물", value: "12 g", ratio: 4 },
      { label: "당류", value: "12 g", ratio: 12 },
      { label: "지방", value: "0.5 g", ratio: 1 },
      { label: "트랜스지방", value: "0.0 g", ratio: 0 },
      { label: "포화지방", value: "0.2 g", ratio: 1 },
      { label: "콜레스테롤", value: "30 mg", ratio: 10 },
      { label: "단백질", value: "7 g", ratio: 13 },
    ],
    diagram: { carbo: 60, protein: 34, fat: 6 }
  },
  "shrimp": {
    id: "shrimp",
    name: "새우깡",
    fullName: "새우깡 (90g)",
    image: shrimpSnack,
    kcal: "465 kcal",
    sodium: 31,
    ingredients: "소맥분, 미강유, 전분, 새우, 팜유, 조미분말 등",
    fullIngredients: "소맥분(밀:미국산), 미강유(태국산), 팜유(말레이시아산), 옥수수전분, 새우(미국산 90%, 국산 10%), 맛베이스조미분말, 혼합제제(타피오카 산화전분, 말토덱스트린), 새우풍미유, 염미시즈닝 *쇠고기, 돼지고기, 토마토, 게, 닭고기, 오징어, 잣, 땅콩, 계란, 조개류(굴, 전복, 홍합 포함)를 사용한 제품과 같은 시설에서 제조하고 있습니다.",
    hasAllergy: true,
    nutrition: [
      { id: 0, category: "칼로리", value: "465", unit: "kcal", ratioText: "하루 권장량의 23%", ratioValue: 23, detail: "", showGauge: false },
      { id: 1, category: "나트륨", value: "610", unit: "mg", ratioText: "하루 권장량의 31%", ratioValue: 31, detail: "", showGauge: true },
      { id: 2, category: "탄수화물", value: "54", unit: "g", ratioText: "하루 권장량의 17%", ratioValue: 17, detail: "", showGauge: true },
      { id: 3, category: "당류", value: "5", unit: "g", ratioText: "하루 권장량의 5%", ratioValue: 5, detail: "", showGauge: true },
      { id: 4, category: "지방", value: "25", unit: "g", ratioText: "하루 권장량의 46%", ratioValue: 46, detail: "트랜스지방: 0.5g 미만\n포화지방: 9g (60%)", showGauge: true, color: "#FF6B6B", isWarning: true },
      { id: 5, category: "단백질", value: "6", unit: "g", ratioText: "하루 권장량의 11%", ratioValue: 11, detail: "", showGauge: true },
      { id: 6, category: "칼슘", value: "85", unit: "mg", ratioText: "하루 권장량의 12%", ratioValue: 12, detail: "", showGauge: true }
    ],
    detailedNutrition: [
      { label: "열량", value: "465 kcal" },
      { label: "나트륨", value: "610 mg", ratio: 31 },
      { label: "탄수화물", value: "54 g", ratio: 17 },
      { label: "당류", value: "5 g", ratio: 5 },
      { label: "지방", value: "25 g", ratio: 46, color: "#FF6B6B" },
      { label: "트랜스지방", value: "0.5 g 미만", ratio: 0 },
      { label: "콜레스테롤", value: "5 mg 미만", ratio: 1 },
      { label: "단백질", value: "6 g", ratio: 11 },
      { label: "칼슘", value: "85 mg", ratio: 12 },
    ],
    diagram: { carbo: 58, protein: 6, fat: 36 }
  },
  "latte": {
    id: "latte",
    name: "바닐라빈 라떼",
    fullName: "바닐라빈 라떼 (325ml)",
    image: coffee,
    kcal: "210 kcal",
    sodium: 9,
    ingredients: "원유, 커피추출액, 설탕, 혼합탈지분유, 유크림 등 (고카페인 함유)",
    fullIngredients: "원유(국산), 정제수, 엘살바도르 워터그라인딩-플라넬드립 커피추출액(커피원두: 엘살바도르산 100%), 설탕, 혼합탈지분유(네덜란드산), 유크림, 향료[바닐라빈추출물{독일산(바닐라빈: 마다가스카르산)}], 탄산수소나트륨, 유화제, 향료(바닐라향)",
    hasAllergy: true,
    nutrition: [
      { id: 0, category: "카페인", value: "105", unit: "mg", ratioText: "105mg", ratioValue: 0, detail: "", showGauge: false, color: "#FF6B6B", isWarning: true },
      { id: 1, category: "칼로리", value: "210", unit: "kcal", ratioText: "하루 권장량의 10%", ratioValue: 10, detail: "", showGauge: false },
      { id: 2, category: "나트륨", value: "170", unit: "mg", ratioText: "하루 권장량의 9%", ratioValue: 9, detail: "", showGauge: true },
      { id: 3, category: "탄수화물", value: "27", unit: "g", ratioText: "하루 권장량의 8%", ratioValue: 8, detail: "", showGauge: true },
      { id: 4, category: "당류", value: "26", unit: "g", ratioText: "하루 권장량의 26%", ratioValue: 26, detail: "", showGauge: true },
      { id: 5, category: "지방", value: "8", unit: "g", ratioText: "하루 권장량의 15%", ratioValue: 15, detail: "트랜스지방: 0g\n포화지방: 4.3g (29%)", showGauge: true },
      { id: 6, category: "단백질", value: "11", unit: "g", ratioText: "하루 권장량의 20%", ratioValue: 20, detail: "", showGauge: true }
    ],
    detailedNutrition: [
      { label: "카페인", value: "105 mg", ratio: 26, color: "#FF6B6B" },
      { label: "열량", value: "210 kcal" },
      { label: "나트륨", value: "170 mg", ratio: 9 },
      { label: "탄수화물", value: "27 g", ratio: 8 },
      { label: "당류", value: "26 g", ratio: 26 },
      { label: "지방", value: "8 g", ratio: 15 },
      { label: "트랜스지방", value: "0 g", ratio: 0 },
      { label: "포화지방", value: "4.3 g", ratio: 29 },
      { label: "콜레스테롤", value: "30 mg", ratio: 10 },
      { label: "단백질", value: "11 g", ratio: 20 },
    ],
    diagram: { carbo: 50, protein: 20, fat: 30 }
  },
  "cola": {
    id: "cola",
    name: "코카콜라",
    fullName: "코카콜라 (355ml)",
    image: cola,
    kcal: "152 kcal",
    sodium: 1,
    ingredients: "정제수, 당류, 이산화탄소, 카라멜색소, 인산, 카페인 등",
    fullIngredients: "정제수, 설탕, 기타과당, 이산화탄소, 카라멜색소, 인산, 천연향료, 카페인(향미증진제)",
    hasAllergy: false,
    nutrition: [
      { id: 0, category: "칼로리", value: "152", unit: "kcal", ratioText: "하루 권장량의 8%", ratioValue: 8, detail: "", showGauge: false },
      { id: 1, category: "나트륨", value: "11", unit: "mg", ratioText: "하루 권장량의 1%", ratioValue: 1, detail: "", showGauge: true },
      { id: 2, category: "탄수화물", value: "38", unit: "g", ratioText: "하루 권장량의 12%", ratioValue: 12, detail: "", showGauge: true },
      { id: 3, category: "당류", value: "38", unit: "g", ratioText: "하루 권장량의 38%", ratioValue: 38, detail: "", showGauge: true, color: "#FF6B6B", isWarning: true },
      { id: 4, category: "지방", value: "0", unit: "g", ratioText: "하루 권장량의 0%", ratioValue: 0, detail: "트랜스지방: 0 g\n포화지방: 0 g (0%)", showGauge: true },
      { id: 5, category: "단백질", value: "0", unit: "g", ratioText: "하루 권장량의 0%", ratioValue: 0, detail: "", showGauge: true }
    ],
    detailedNutrition: [
      { label: "열량", value: "152 kcal" },
      { label: "나트륨", value: "11 mg", ratio: 1 },
      { label: "탄수화물", value: "38 g", ratio: 12 },
      { label: "당류", value: "38 g", ratio: 38, color: "#FF6B6B" },
      { label: "지방", value: "0 g", ratio: 0 },
      { label: "트랜스지방", value: "0 g", ratio: 0 },
      { label: "포화지방", value: "0 g", ratio: 0 },
      { label: "콜레스테롤", value: "0 mg", ratio: 0 },
      { label: "단백질", value: "0 g", ratio: 0 },
    ],
    diagram: { carbo: 100, protein: 0, fat: 0 }
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'data'>('home');
  const [selectedFoodId, setSelectedFoodId] = useState<string>("bibim");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [showProductDiagram, setShowProductDiagram] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFoodId, setModalFoodId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("배고파! 나에게 맞는 음식을 골라줘.");
  const [isEating, setIsEating] = useState(false);
  const [showAllergyPopup, setShowAllergyPopup] = useState(false);
  const [showScanningScreen, setShowScanningScreen] = useState(false);
  const [showAllergyResult, setShowAllergyResult] = useState(false);
  const [showDragGuide, setShowDragGuide] = useState(true);
  const [showPostColaGuide, setShowPostPostColaGuide] = useState(false);
  const [showBibimCoachMark, setShowBibimCoachMark] = useState(false);
  const [showBibimSwipeGuide, setShowBibimSwipeGuide] = useState(false);
  const [hasSeenBibimSwipeGuide, setHasSeenBibimSwipeGuide] = useState(false);
  const [showBibimFatCoachMark, setShowBibimFatCoachMark] = useState(false);
  const [hasSeenBibimFatCoachMark, setHasSeenBibimFatCoachMark] = useState(false);
  const [showBibimIngredientMessage, setShowBibimIngredientMessage] = useState(false);
  const [showLatteIngredientMessage, setShowLatteIngredientMessage] = useState(false);
  const [showBibimKcalInfoMessage, setShowBibimKcalInfoMessage] = useState(false);
  const [hasFlippedCurrentCard, setHasFlippedCurrentCard] = useState(false);
  const [hasViewedIngredients, setHasViewedIngredients] = useState(false);
  const [showFlipRequiredAlert, setShowFlipRequiredAlert] = useState(false);
  const [isIngredientAudioPlaying, setIsIngredientAudioPlaying] = useState(false);

  const x = useMotionValue(0);
  const characterRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const allergyAudioRef = useRef<HTMLAudioElement | null>(null);
  const allergyAlertAudioRef = useRef<HTMLAudioElement | null>(null);
  const bibimIngredientAudioRef = useRef<HTMLAudioElement | null>(null);
  const latteIngredientAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedAllergySoundThisDrag = useRef(false);
  const scanningTimeoutRef = useRef<any>(null);

  const playHungrySound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(hungrySound);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(err => console.error("Audio playback failed:", err));
  };

  const playAllergySound = () => {
    if (!allergyAudioRef.current) {
      allergyAudioRef.current = new Audio(allergySound);
    }
    allergyAudioRef.current.currentTime = 0;
    allergyAudioRef.current.play().catch(err => console.error("Allergy audio playback failed:", err));
  };

  const playAllergyAlertSound = () => {
    if (!allergyAlertAudioRef.current) {
      allergyAlertAudioRef.current = new Audio(allergyAlertSound);
    }
    allergyAlertAudioRef.current.currentTime = 0;
    allergyAlertAudioRef.current.play().catch(err => console.error("Allergy alert audio playback failed:", err));
  };

  const playBibimIngredientSound = () => {
    if (!bibimIngredientAudioRef.current) {
      bibimIngredientAudioRef.current = new Audio(ingredientSound);
      bibimIngredientAudioRef.current.onplay = () => setIsIngredientAudioPlaying(true);
      bibimIngredientAudioRef.current.onended = () => setIsIngredientAudioPlaying(false);
    }
    bibimIngredientAudioRef.current.currentTime = 0;
    bibimIngredientAudioRef.current.play().catch(err => {
      console.error("Bibim ingredient audio playback failed:", err);
      setIsIngredientAudioPlaying(false);
    });
  };

  const playLatteIngredientSound = () => {
    if (!latteIngredientAudioRef.current) {
      latteIngredientAudioRef.current = new Audio(latteIngredientSound);
      latteIngredientAudioRef.current.onplay = () => setIsIngredientAudioPlaying(true);
      latteIngredientAudioRef.current.onended = () => setIsIngredientAudioPlaying(false);
    }
    latteIngredientAudioRef.current.currentTime = 0;
    latteIngredientAudioRef.current.play().catch(err => {
      console.error("Latte ingredient audio playback failed:", err);
      setIsIngredientAudioPlaying(false);
    });
  };

  const bibimAllergies = [
    { id: 1, name: '알류 (달걀)', icon: '🥚' },
    { id: 2, name: '대두 (콩)', icon: '🫘' },
    { id: 3, name: '밀', icon: '🌾' },
    { id: 4, name: '우유', icon: '🥛' },
    { id: 5, name: '돼지고기', icon: '🐖' },
    { id: 6, name: '쇠고기', icon: '🐂' },
    { id: 7, name: '조개류 (굴)', icon: '🦪' }
  ];

  const shrimpAllergies = [
    { id: 1, name: '밀', icon: '🌾' },
    { id: 2, name: '새우', icon: '🦐' },
    { id: 3, name: '대두', icon: '🫘' },
    { id: 4, name: '우유', icon: '🥛' }
  ];

  const saladAllergies = [
    { id: 1, name: '대두', icon: '🫘' },
    { id: 2, name: '아황산류', icon: '🧪' },
    { id: 3, name: '닭고기', icon: '🍗' },
    { id: 4, name: '토마토', icon: '🍅' }
  ];

  const latteAllergies = [
    { id: 1, name: '우유', icon: '🥛' }
  ];

  const colaAllergies = [];

  const handleFoodDrop = (foodId: string, info: any) => {
    if (!characterRef.current) return;
    
    const charRect = characterRef.current.getBoundingClientRect();
    const dropX = info.point.x;
    const dropY = info.point.y;

    // Check if drop point is within character bounds (with a bit of padding for easier hit)
    const padding = 20;
    if (
      dropX >= charRect.left - padding &&
      dropX <= charRect.right + padding &&
      dropY >= charRect.top - padding &&
      dropY <= charRect.bottom + padding
    ) {
      if (foodId === 'bibim') {
        setStatusMessage("맛있다! 근데 조금 짠 것 같아");
        setIsEating(true);
      } else if (foodId === 'salad') {
        setStatusMessage("맛있다! 건강해서 좋아");
        setIsEating(true);
      } else if (foodId === 'shrimp') {
        setStatusMessage("으악! 난 새우 못 먹어");
        setIsEating(false); // No eating animation/heart for allergy
      } else if (foodId === 'latte') {
        setStatusMessage("카페인 때문에 잠을 못 자겠어! ");
        setIsEating(false); // No eating animation/heart for caffeine sensitivity
      } else if (foodId === 'cola') {
        setStatusMessage("좀 달지만 맛있다!");
        setIsEating(true);
      } else {
        const foodName = FOOD_DATA[foodId as keyof typeof FOOD_DATA]?.name || "음식";
        setStatusMessage(`${foodName} 맛있다! 😋`);
        setIsEating(true);
      }

      if (foodId === 'cola') {
        setTimeout(() => {
          setShowPostPostColaGuide(true);
        }, 2000);
      }
      
      // Reset after 2 seconds
      setTimeout(() => {
        setStatusMessage("배고파! 나에게 맞는 음식을 골라줘.");
        setIsEating(false);
      }, 2000);
    }
  };
  
  // Categories for Explore Tab
  const categories = [
    { id: 1, name: '정성 가득 비빔밥', icon: '🍱' },
    { id: 2, name: '스모크 닭가슴살 샐러드', icon: '🥗' },
    { id: 3, name: '새우깡', icon: '🦐' },
    { id: 4, name: '바닐라빈 라떼', icon: '☕' },
    { id: 5, name: '코카콜라', icon: '🥤' },
  ];

  const openCard = (foodId: string) => {
    setModalFoodId(foodId);
    setIsModalOpen(true);
  };

  const closeCard = () => {
    setIsModalOpen(false);
    setModalFoodId(null);
  };

  const confirmFeed = () => {
    if (!modalFoodId) return;
    const food = FOOD_DATA[modalFoodId];
    
    if (food.hasAllergy) {
      if (modalFoodId === 'shrimp') {
        setStatusMessage("으악! 난 새우 못 먹어");
        setTimeout(() => {
          setStatusMessage("배고파! 나에게 맞는 음식을 골라줘.");
        }, 2000);
      }
      alert("⚠️ 캐릭터에게 새우 알레르기가 있습니다! 다른 음식을 골라주세요.");
      return;
    }
    
    if (food.id === 'latte' || food.id === 'cola') {
      alert("☕ 캐릭터가 카페인에 예민합니다. 주의가 필요해요!");
    }

    if (food.sodium && food.sodium > 70) {
      alert("🧂 나트륨이 너무 높습니다! 캐릭터의 건강을 위해 조절해주세요.");
    }

    if (modalFoodId === 'bibim') {
      setStatusMessage("맛있다! 근데 조금 짠 것 같아");
      setIsEating(true);
    } else if (modalFoodId === 'salad') {
      setStatusMessage("맛있다! 건강해서 좋아");
      setIsEating(true);
    } else if (modalFoodId === 'shrimp') {
      setStatusMessage("으악! 난 새우 못 먹어");
      setIsEating(false);
    } else if (modalFoodId === 'latte') {
      setStatusMessage("카페인 때문에 잠을 못 자겠어! ");
      setIsEating(false);
    } else {
      setStatusMessage(`${food.name} 맛있다! 😋`);
      setIsEating(true);
    }
    
    setTimeout(() => {
      setStatusMessage("배고파! 나에게 맞는 음식을 골라줘.");
      setIsEating(false);
    }, 2000);

    if (modalFoodId === 'cola') {
      setTimeout(() => {
        setShowPostPostColaGuide(true);
      }, 2000);
    }

    alert(`${food.fullName}을(를) 먹였습니다! 캐릭터가 기뻐합니다.`);
    closeCard();
  };

  // 1. Top card rotation based on drag
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  
  // 2. Next card "Smooth Peek" effect (Swiping Left)
  const dragProgressNext = useTransform(x, [-200, 0], [1, 0]);
  const nextCardOpacity = useTransform(dragProgressNext, [0, 1], [0.3, 1]);
  const nextCardScale = useTransform(dragProgressNext, [0, 1], [0.9, 1]);
  const nextCardY = useTransform(dragProgressNext, [0, 1], [10, 0]);

  // 3. Previous card "Recovery Peek" effect (Swiping Right)
  const dragProgressPrev = useTransform(x, [0, 200], [0, 1]);
  const prevCardOpacity = useTransform(dragProgressPrev, [0, 1], [0, 1]);
  const prevCardX = useTransform(dragProgressPrev, [0, 1], [-300, -10]);
  const prevCardRotate = useTransform(dragProgressPrev, [0, 1], [-20, -5]);

  const handleDragEnd = (_: any, info: any) => {
    const swipeThreshold = 100;
    const nutritionData = FOOD_DATA[selectedFoodId].nutrition;
    
    if (info.offset.x < -swipeThreshold) {
      // Swipe Left (Next)
      
      const isFatCard = nutritionData[currentIndex].category === "지방";
      const isBibim = selectedFoodId === "bibim";
      
      // Validation rules:
      // 1. ALL foods: Fat card (지방) MUST be flipped (requirement 2)
      // 2. Non-Bibim foods: MUST have viewed Detailed Info + Ingredients (requirement 8 clarification)
      const needsFlip = isFatCard;
      const needsDetailedView = !isBibim;

      const flipOk = !needsFlip || hasFlippedCurrentCard;
      const detailedOk = !needsDetailedView || hasViewedIngredients;

      if (!flipOk || !detailedOk) {
        // Show alert
        setShowFlipRequiredAlert(true);
        setTimeout(() => setShowFlipRequiredAlert(false), 2000);
        // Snap back
        x.set(0);
        return;
      }

      if (currentIndex < nutritionData.length - 1) {
        setSwipeDirection('left');
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setIsFlipped(false);
        setHasFlippedCurrentCard(false);

        // Fat coach mark trigger for Bibim
        if (selectedFoodId === 'bibim' && nutritionData[nextIdx].category === '지방' && !hasSeenBibimFatCoachMark) {
          setShowBibimFatCoachMark(true);
          setHasSeenBibimFatCoachMark(true);
        }

        // Kcal info message trigger for Bibim
        if (selectedFoodId === 'bibim' && currentIndex === 0 && nextIdx === 1) {
          setShowBibimKcalInfoMessage(true);
          setTimeout(() => setShowBibimKcalInfoMessage(false), 4000);
        }
      } else {
        setIsFinished(true);
        // Show allergy popup after all cards are finished
        setShowAllergyPopup(true);
        // Play sound when popup appears to sync with visual
        playAllergySound();
      }
    } else if (info.offset.x > swipeThreshold) {
      // Swipe Right (Previous)
      if (currentIndex > 0) {
        setSwipeDirection('right');
        setCurrentIndex(currentIndex - 1);
        setIsFlipped(false);
        setHasFlippedCurrentCard(false);
      }
    }
    
    // Reset x value
    x.set(0);
  };

  const currentFood = FOOD_DATA[selectedFoodId];
  const nutritionData = currentFood.nutrition;
  const currentCard = nutritionData[currentIndex];
  const nextCard = currentIndex + 1 < nutritionData.length ? nutritionData[currentIndex + 1] : null;
  const prevCard = currentIndex > 0 ? nutritionData[currentIndex - 1] : null;

  const modalFood = modalFoodId ? FOOD_DATA[modalFoodId] : null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f2f5] p-4 select-none overflow-hidden">
      {/* Phone Viewport */}
      <div className="relative w-[360px] h-[740px] bg-neumo-bg rounded-[45px] shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-[8px] border-[#222] overflow-hidden flex flex-col">
        
        {showAllergyPopup && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowAllergyPopup(false)}
            />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="relative bg-white rounded-[30px] p-8 shadow-2xl text-center max-w-[280px] border-4 border-neumo-blue"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowAllergyPopup(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                aria-label="닫기"
              >
                <X size={18} strokeWidth={3} />
              </button>

              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-[18px] font-black text-gray-800 mb-2 leading-tight">
                알러지 정보도<br />확인해야 해!
              </h3>
              <button 
                onClick={() => {
                  setShowAllergyPopup(false);
                  setShowScanningScreen(true);
                  scanningTimeoutRef.current = setTimeout(() => {
                    setShowScanningScreen(false);
                    setShowAllergyResult(true);
                    playAllergyAlertSound();
                  }, 2000);
                }}
                className="w-full py-3 bg-neumo-blue text-white rounded-xl font-black shadow-lg active:scale-95 transition-transform"
              >
                확인하러가기
              </button>
            </motion.div>
          </div>
        )}
        {showScanningScreen && (
          <div className="absolute inset-0 z-[110] bg-neumo-bg flex flex-col items-center justify-center">
            <div className="scanning-screen">
              <div className="scanning-container">
                <div className="wave wave1"></div>
                <div className="wave wave2"></div>
                <div className="wave wave3"></div>
                <div className="center-icon">
                  <img src={tamagotchiMagnifier} alt="캐릭터" referrerPolicy="no-referrer" />
                </div>
              </div>
              <p className="scanning-text">{currentFood.name} 속 알러지 성분 분석 중...</p>
              <button 
                onClick={() => {
                  if (scanningTimeoutRef.current) {
                    clearTimeout(scanningTimeoutRef.current);
                    scanningTimeoutRef.current = null;
                  }
                  setShowScanningScreen(false);
                  setIsFinished(false); // Reset finished state so cards are visible
                  setActiveTab('data');
                }}
                className="mt-12 px-8 py-3 bg-white/50 text-gray-500 rounded-full text-sm font-bold shadow-neumo-card active:scale-95 transition-transform"
              >
                돌아가기
              </button>
            </div>
          </div>
        )}

        {showAllergyResult && (
          <div className="allergy-result-container">
            {(() => {
              const currentAllergies = selectedFoodId === 'bibim' 
                ? bibimAllergies 
                : selectedFoodId === 'shrimp' 
                ? shrimpAllergies 
                : selectedFoodId === 'salad'
                ? saladAllergies
                : selectedFoodId === 'latte'
                ? latteAllergies
                : selectedFoodId === 'cola'
                ? colaAllergies
                : [];
              
              return (
                <>
                  <h2 className="result-title">⚠️ 확인된 알러지 성분 ({currentAllergies.length}종)</h2>
                  <div className="allergy-list">
                    {currentAllergies.map((item, index) => (
                      <div 
                        key={item.id} 
                        className="allergy-card morph-item"
                        style={{ animationDelay: `${(index + 1) * 0.2}s` }}
                      >
                        <span className="item-icon">{item.icon}</span>
                        <span className="item-name">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
            <button 
              className="reset-btn" 
              onClick={() => {
                setShowAllergyResult(false);
                if (isFinished && selectedFoodId === 'cola') {
                  setTimeout(() => {
                    confetti({
                      particleCount: 150,
                      spread: 70,
                      origin: { y: 0.6 },
                      zIndex: 1000,
                      colors: ['#4A90E2', '#34D399', '#FBBF24', '#F87171']
                    });
                  }, 500);
                }
              }}
            >
              다음으로
            </button>
          </div>
        )}

        {activeTab === 'home' && (
          <div id="main-screen" className="screen">
            <AnimatePresence>
              {showDragGuide && (
                <div className="absolute inset-0 z-[200] flex items-center justify-center p-6">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative bg-white rounded-[30px] p-8 shadow-2xl text-center max-w-[280px] border-4 border-neumo-blue"
                  >
                    <div className="absolute top-4 left-6 text-left">
                      <span className="text-neumo-blue font-black text-[11px] uppercase tracking-wider opacity-60">냠냠 다마고치</span>
                    </div>
                    <button 
                      onClick={() => setShowDragGuide(false)}
                      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200"
                    >
                      <X size={18} strokeWidth={3} />
                    </button>
                    <div className="text-4xl mb-4">😋</div>
                    <h3 className="text-[18px] font-black text-gray-800 mb-4 leading-tight">
                      캐릭터에게 드래그하여<br />음식을 먹여보세요!
                    </h3>
                    <button 
                      onClick={() => setShowDragGuide(false)}
                      className="w-full py-3 bg-neumo-blue text-white rounded-xl font-black shadow-lg"
                    >
                      시작하기
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showPostColaGuide && (
                <div className="absolute inset-0 z-[200] flex items-center justify-center p-6">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative bg-white rounded-[30px] p-8 shadow-2xl text-center max-w-[280px] border-4 border-neumo-blue"
                  >
                    <div className="absolute top-4 left-6 text-left">
                      <span className="text-neumo-blue font-black text-[11px] uppercase tracking-wider opacity-60">냠냠 다마고치</span>
                    </div>
                    <button 
                      onClick={() => setShowPostPostColaGuide(false)}
                      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200"
                    >
                      <X size={18} strokeWidth={3} />
                    </button>
                    <div className="text-4xl mb-4">💡</div>
                    <h3 className="text-[18px] font-black text-gray-800 mb-4 leading-tight">
                      탐색 탭에서<br />영양정보를 확인해보세요!
                    </h3>
                    <button 
                      onClick={() => {
                        setShowPostPostColaGuide(false);
                        setActiveTab('explore');
                      }}
                      className="w-full py-3 bg-neumo-blue text-white rounded-xl font-black shadow-lg"
                    >
                      확인
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <header className="mission-header">
              <h2>냠냠 다마고치: 오늘 뭐 먹지?</h2>
              <p>캐릭터에게 가장 안전한 음식을 골라주세요</p>
            </header>

            <section className="character-section">
              <div className="character-visual" ref={characterRef}>
                <motion.div 
                  className="character-img cursor-pointer"
                  onClick={playHungrySound}
                  whileTap={{ scale: 0.95 }}
                  animate={isEating ? { 
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, 0]
                  } : {}}
                  transition={{ duration: 0.5, repeat: isEating ? 3 : 0 }}
                >
                  <img src={tamagotchi} alt="다마고치 캐릭터" className="w-[150px] h-[150px] object-contain" referrerPolicy="no-referrer" />
                  {isEating && (
                    <motion.div 
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: -50 }}
                      className="absolute top-0 text-3xl"
                    >
                      ❤️
                    </motion.div>
                  )}
                </motion.div> 
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={statusMessage}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    className="status-bubble"
                  >
                    "{statusMessage}"
                  </motion.div>
                </AnimatePresence>
                <div className="text-[13px] text-gray-400 mt-2 font-medium italic">터치하여 인사하고, 음식을 드래그하여 줄 수 있어요</div>
              </div>
              
              <div className="character-profile">
                <h3>나의 특성</h3>
                <ul>
                  <li>❌ <strong>새우 알레르기</strong></li>
                  <li>☕ <strong>카페인 예민</strong></li>
                  <li>🧂 <strong>나트륨 조절</strong></li>
                  <li>🍽️ <strong>일일 2,000kcal 섭취</strong></li>
                </ul>
              </div>
            </section>

            <section className="food-drag-section">
              <div className="food-drag-grid">
                {[
                  { id: 'bibim', emoji: '🍱', name: '정성 가득 비빔밥' },
                  { id: 'salad', emoji: '🥗', name: '스모크 닭가슴살 샐러드' },
                  { id: 'shrimp', emoji: '🦐', name: '새우깡' },
                  { id: 'latte', emoji: '☕', name: '바닐라빈 라떼' },
                  { id: 'cola', emoji: '🥤', name: '코카콜라' }
                ].map((food) => (
                  <motion.div
                    key={food.id}
                    className="food-drag-item"
                    drag
                    dragSnapToOrigin
                    onDragEnd={(_, info) => {
                      // Only trigger drop logic if it was actually dragged
                      if (Math.abs(info.offset.x) > 5 || Math.abs(info.offset.y) > 5) {
                        handleFoodDrop(food.id, info);
                      }
                    }}
                    whileDrag={{ scale: 1.2, zIndex: 50 }}
                  >
                    <span className="text-2xl">{food.emoji}</span>
                    <span className="text-[10px] mt-1 font-bold">{food.name}</span>
                  </motion.div>
                ))}
              </div>
              <p className="drag-hint">캐릭터에게 드래그하거나, 탐색 탭에서 데이터를 확인하세요!</p>
            </section>
          </div>
        )}
        {activeTab === 'data' && (
          <div className="flex flex-col h-full relative">
            {/* Bibim Coach Mark - Full Screen Overlay */}
            <AnimatePresence>
              {selectedFoodId === 'bibim' && showBibimCoachMark && !isFinished && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[200] bg-black/50 flex flex-col items-center pointer-events-none"
                >
                  {/* Position items to overlay the product section */}
                  <div className="h-[42%] w-full flex flex-col items-center justify-center pt-12">
                    <div className="flex flex-col items-center animate-bounce mb-8">
                      <div className="bg-white/20 p-4 rounded-full backdrop-blur-md border border-white/30">
                        <Pointer size={40} className="text-white fill-white rotate-[15deg]" />
                      </div>
                    </div>
                    <p className="text-white font-black text-[18px] text-center drop-shadow-lg px-4">
                      탭하여 함량과 성분 확인
                    </p>
                    
                    {/* Pulsing circle guide */}
                    <motion.div 
                      className="absolute w-32 h-32 border-4 border-white/60 rounded-full"
                      style={{ top: '21%', left: '50%', x: '-50%', y: '-50%' }}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bibim Swipe Guide - Full Screen Overlay */}
            <AnimatePresence>
              {selectedFoodId === 'bibim' && showBibimSwipeGuide && !isFinished && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[200] bg-black/50 flex flex-col items-center pointer-events-none"
                >
                   {/* Interface container for overlay content */}
                   <div className="flex-1 w-full relative flex flex-col items-center pt-[55%]">
                    {/* Floating Hand Icon Moving Right to Left */}
                    <div className="relative w-full h-[60px]">
                      <motion.div 
                        className="absolute right-10"
                        initial={{ x: 0, opacity: 0 }}
                        animate={{ 
                          x: [-20, -200],
                          opacity: [0, 1, 1, 0] 
                        }}
                        transition={{ 
                          duration: 1.8, 
                          repeat: Infinity,
                          times: [0, 0.2, 0.8, 1],
                          ease: "easeInOut"
                        }}
                      >
                        <div className="bg-white/20 p-4 rounded-full backdrop-blur-md border border-white/30">
                          <Pointer size={48} className="text-white fill-white rotate-[-30deg]" />
                        </div>
                      </motion.div>
                    </div>

                    <div className="mt-12 w-full text-center">
                       <p className="text-white font-black text-[20px] drop-shadow-lg px-10 leading-snug">
                        넘겨서 하루권장량과<br />함량 확인
                      </p>
                    </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bibim Fat Coach Mark - Full Screen Overlay */}
            <AnimatePresence>
              {selectedFoodId === 'bibim' && showBibimFatCoachMark && currentCard.category === '지방' && !isFinished && !isFlipped && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-[200] bg-black/50 flex flex-col items-center pointer-events-none"
                >
                   <div className="flex-1 w-full relative flex flex-col items-center justify-center">
                    {/* Floating Hand Icon Moving Up and Down */}
                    <div className="relative w-full flex justify-center mb-4">
                      <motion.div 
                        initial={{ y: 0, opacity: 0 }}
                        animate={{ 
                          y: [0, -40, 0],
                          opacity: 1
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <div className="bg-white/20 p-4 rounded-full backdrop-blur-md border border-white/30">
                          <Pointer size={48} className="text-white fill-white" />
                        </div>
                      </motion.div>
                    </div>

                    <div className="text-center">
                       <p className="text-white font-black text-[22px] drop-shadow-lg px-6 leading-snug">
                        탭하여 지방 상세 정보 확인
                      </p>
                    </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product Name Header */}
            <div className="absolute top-12 left-0 right-0 flex justify-center z-20">
              <span className="text-[16px] font-black text-neumo-blue tracking-tight">
                {currentFood.fullName}
              </span>
            </div>

            {/* Product Section (Top 40%) */}
            <div className="h-[42%] flex justify-center items-center px-6 pt-12 relative">
              <AnimatePresence mode="wait">
                {!isFinished && (
                  <motion.div 
                    key={`${selectedFoodId}-image`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="product-image cursor-pointer flex flex-col items-center"
                    onClick={() => {
                      setShowProductDiagram(true);
                      if (selectedFoodId === 'bibim') {
                        setShowBibimCoachMark(false);
                      }
                    }}
                  >
                    <img 
                      src={currentFood.image} 
                      alt={currentFood.fullName} 
                      className="w-[180px] h-[180px] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)]"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[14px] text-gray-400 mt-2 font-medium opacity-80">
                      탭하여 자세히 보기
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Nutrition Modal Overlay */}
            <AnimatePresence>
              {showProductDiagram && (
                <div className="absolute inset-0 z-[150] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/30 backdrop-blur-md"
                    onClick={() => {
                      setShowProductDiagram(false);
                      if (selectedFoodId === 'bibim' && !hasSeenBibimSwipeGuide) {
                        // We'll trigger after ingredients
                      }
                    }}
                  />
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white/95 backdrop-blur-xl rounded-[30px] p-6 shadow-2xl w-full max-w-[320px] border border-white/40"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[14px] font-black text-gray-800">영양 성분 상세 정보</h4>
                      <button 
                        onClick={() => {
                          setShowProductDiagram(false);
                      if (selectedFoodId === 'bibim' && !hasSeenBibimSwipeGuide) {
                        // We'll trigger after ingredients
                      }
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(() => {
                        const maxRatio = Math.max(...(currentFood.detailedNutrition?.map(n => n.ratio || 0) || [0]));
                        return currentFood.detailedNutrition?.map((item, idx) => (
                          <div key={idx} className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center text-[12px]">
                              <span className="font-bold text-gray-500">{item.label}</span>
                              <span className="font-black text-gray-800">
                                {item.value} {item.ratio !== undefined && <span className="text-neumo-blue ml-1">{item.ratio}%</span>}
                              </span>
                            </div>
                            {item.ratio !== undefined && (
                              <div className="w-full h-[6px] bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.ratio}%` }}
                                  transition={{ duration: 1, delay: idx * 0.05 }}
                                  className="h-full rounded-full"
                                  style={{ 
                                    backgroundColor: item.ratio === maxRatio && maxRatio > 0 
                                      ? '#FF6B6B' // Highlight color (Soft Red)
                                      : '#D1D5DB' // Unified color (Gray-300)
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        ));
                      })()}
                    </div>
                    <button 
                      onClick={() => {
                        setShowProductDiagram(false);
                        setShowIngredients(true);
                        setHasViewedIngredients(true);
                        if (selectedFoodId === 'bibim') {
                          setTimeout(() => {
                            setShowBibimIngredientMessage(true);
                            playBibimIngredientSound();
                          }, 1000);
                        }
                        if (selectedFoodId === 'latte') {
                          setTimeout(() => {
                            setShowLatteIngredientMessage(true);
                            playLatteIngredientSound();
                          }, 1000);
                        }
                      }}
                      className="mt-6 w-full py-3 bg-neumo-blue text-white rounded-xl font-black shadow-lg active:scale-95 transition-transform"
                    >
                      다음으로
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* Ingredients Modal Overlay */}
            <AnimatePresence>
              {showIngredients && (
                <div className="absolute inset-0 z-[150] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/30 backdrop-blur-md"
                    onClick={() => {
                      if (isIngredientAudioPlaying) return;
                      setShowIngredients(false);
                      setShowBibimIngredientMessage(false);
                      setShowLatteIngredientMessage(false);
                      if (selectedFoodId === 'bibim' && !hasSeenBibimSwipeGuide) {
                        setShowBibimSwipeGuide(true);
                      }
                    }}
                  />
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white/95 backdrop-blur-xl rounded-[30px] p-6 shadow-2xl w-full max-w-[320px] border border-white/40"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[14px] font-black text-gray-800">원재료명 및 함량</h4>
                      <button 
                        onClick={() => {
                          if (isIngredientAudioPlaying) return;
                          setShowIngredients(false);
                          setShowBibimIngredientMessage(false);
                          setShowLatteIngredientMessage(false);
                          if (selectedFoodId === 'bibim' && !hasSeenBibimSwipeGuide) {
                            setShowBibimSwipeGuide(true);
                          }
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      <p className="text-[12px] leading-[1.6] text-gray-600 font-medium break-all">
                        {(() => {
                          const text = currentFood.fullIngredients || currentFood.ingredients || '';
                          const commaIndex = text.indexOf(',');
                          const bracketStartIndex = text.indexOf('(');
                          
                          // Handle cases like "쌀(국산), ..." or "소맥분, ..."
                          let splitIndex = -1;
                          if (commaIndex !== -1 && bracketStartIndex !== -1) {
                            // If '(' comes before ',', check if it belongs to the first ingredient
                            if (bracketStartIndex < commaIndex) {
                              // We need to find the comma AFTER the matching closing bracket or just the first comma if no brackets.
                              // Simple approach: split by the first comma and bold the prefix.
                              splitIndex = commaIndex;
                            } else {
                              splitIndex = commaIndex;
                            }
                          } else if (commaIndex !== -1) {
                            splitIndex = commaIndex;
                          }

                          if (splitIndex !== -1) {
                            const first = text.substring(0, splitIndex);
                            const rest = text.substring(splitIndex);
                            return (
                              <>
                                <span className="text-gray-900 font-black underline decoration-neumo-blue/30 underline-offset-4">{first}</span>
                                {rest}
                              </>
                            );
                          }
                          return text;
                        })()}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        if (isIngredientAudioPlaying) return;
                        setShowIngredients(false);
                        setShowBibimIngredientMessage(false);
                        setShowLatteIngredientMessage(false);
                        if (selectedFoodId === 'bibim' && !hasSeenBibimSwipeGuide) {
                          setShowBibimSwipeGuide(true);
                        }
                      }}
                      className="mt-6 w-full py-3 bg-neumo-blue text-white rounded-xl font-black shadow-lg active:scale-95 transition-transform"
                    >
                      닫기
                    </button>

                    {/* Bibim/Latte Character Message */}
                    <AnimatePresence>
                      {((selectedFoodId === 'bibim' && showBibimIngredientMessage) || 
                        (selectedFoodId === 'latte' && showLatteIngredientMessage)) && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20, y: 0 }}
                          animate={{ opacity: 1, x: 0, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute -bottom-20 -right-4 flex flex-col items-end pointer-events-none z-[160]"
                        >
                          <div className="bg-white px-4 py-2 rounded-2xl shadow-xl border-2 border-neumo-blue text-[13px] font-black text-gray-800 mb-2 relative">
                            {selectedFoodId === 'bibim' ? (
                              <>맨 앞에 있는 원재료가<br />가장 많이 들어있구나!</>
                            ) : (
                              <>라떼에는 역시 원유가<br />가장 많이 들었구나!</>
                            )}
                            <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white border-r-2 border-b-2 border-neumo-blue rotate-45"></div>
                          </div>
                          <img src={tamagotchi} alt="캐릭터" className="w-20 h-20 object-contain drop-shadow-lg" referrerPolicy="no-referrer" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
            <div className="flex-1 relative perspective-1500 flex justify-center items-start">
              <AnimatePresence mode="popLayout" custom={swipeDirection}>
                {!isFinished ? (
                  <div className="relative w-full h-full flex justify-center items-start">
                    
                    {/* Previous Card (Recovery Peek) */}
                    {prevCard && (
                      <motion.div
                        key={`prev-${prevCard.id}`}
                        style={{ 
                          opacity: prevCardOpacity, 
                          x: prevCardX,
                          rotate: prevCardRotate,
                          zIndex: 20 // Pulling from left, should be over current if dragging right
                        }}
                        className="absolute w-[300px] h-[320px] bg-neumo-bg rounded-[30px] shadow-neumo-card p-[35px_25px] flex flex-col justify-between pointer-events-none"
                      >
                        <div>
                          <h2 className="text-[22px] font-black text-neumo-text-main">{prevCard.category}</h2>
                          <div className="text-[44px] font-black mt-4 text-neumo-text-main">
                            {prevCard.value} <span className="text-[24px] font-normal">{prevCard.unit}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Next Card (Smooth Peek) */}
                    {nextCard && (
                      <motion.div
                        key={`next-${nextCard.id}`}
                        style={{ 
                          opacity: nextCardOpacity, 
                          scale: nextCardScale,
                          y: nextCardY,
                          zIndex: 0
                        }}
                        className="absolute w-[300px] h-[320px] bg-neumo-bg rounded-[30px] shadow-neumo-card p-[35px_25px] flex flex-col justify-between pointer-events-none"
                      >
                        <div>
                          <h2 className="text-[22px] font-black text-neumo-text-main">{nextCard.category}</h2>
                          <div className="text-[44px] font-black mt-4 text-neumo-text-main">
                            {nextCard.value} <span className="text-[24px] font-normal">{nextCard.unit}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Active Top Card */}
                    <motion.div
                      key={currentCard.id}
                      style={{ x, rotate, zIndex: 10 }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragStart={() => {
                        hasPlayedAllergySoundThisDrag.current = false;
                        if (selectedFoodId === 'bibim' && showBibimSwipeGuide) {
                          setShowBibimSwipeGuide(false);
                          setHasSeenBibimSwipeGuide(true);
                        }
                      }}
                      onDrag={(_, info) => {
                        // Sound is now played in handleDragEnd when the popup appears
                      }}
                      onDragEnd={handleDragEnd}
                      onClick={() => {
                        if (currentCard.category === '지방') {
                          setIsFlipped(!isFlipped);
                          setHasFlippedCurrentCard(true);
                        }
                        if (selectedFoodId === 'bibim' && showBibimSwipeGuide) {
                          setShowBibimSwipeGuide(false);
                          setHasSeenBibimSwipeGuide(true);
                        }
                        if (selectedFoodId === 'bibim' && showBibimFatCoachMark) {
                          setShowBibimFatCoachMark(false);
                        }
                      }}
                      initial={{ scale: 0.9, y: 10, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      exit={{ 
                        x: swipeDirection === 'left' ? -600 : 600, 
                        rotate: swipeDirection === 'left' ? -30 : 30,
                        opacity: 0, 
                        transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] } 
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="absolute w-[300px] h-[320px] cursor-pointer transform-style-3d"
                    >
                      {/* Swipe Indicator Arrow */}
                      {nextCard && !isFlipped && (
                        <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-50 pointer-events-none animate-arrow-bounce">
                          <div className="bg-gradient-to-r from-neumo-blue to-blue-400 p-2 rounded-full shadow-lg">
                            <ChevronRight size={24} className="text-white" strokeWidth={3} />
                          </div>
                        </div>
                      )}

                      <motion.div 
                        className={`relative w-full h-full transform-style-3d ${isFlipped ? 'is-flipped' : ''}`}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      >
                        {/* Front Face */}
                        <div className={`absolute inset-0 rounded-[30px] shadow-neumo-card p-[35px_25px] flex flex-col justify-between backface-hidden border border-white/20 ${currentCard.isWarning ? 'animate-pulse-red' : 'bg-neumo-bg'}`}>
                          <div>
                            <h2 className="text-[20px] font-black text-neumo-text-main">{currentCard.category}</h2>
                            <div className="mt-4">
                              <p 
                                className="font-black leading-tight tracking-tighter"
                                style={{ color: currentCard.color || 'var(--color-neumo-blue)' }}
                              >
                                <span className="text-[14px] block mb-0.5 opacity-70">
                                  {currentCard.category === "카페인" ? "총 함량" : currentCard.category === "칼로리" ? "\u00A0" : "하루 권장량의"}
                                </span>
                                <span className="text-[42px]">
                                  {currentCard.category === "칼로리" 
                                    ? `${currentCard.value}${currentCard.unit}` 
                                    : currentCard.ratioText.replace('하루 권장량의 ', '')
                                  }
                                </span>
                              </p>
                              {(currentCard.category !== "카페인" && currentCard.category !== "칼로리") && (
                                <div className="text-[14px] font-bold mt-1 text-neumo-text-main opacity-40">
                                  함량: {currentCard.value}{currentCard.unit}
                                </div>
                              )}
                            </div>
                            
                            {currentCard.category === "카페인" && (
                              <div className="flex flex-col items-center mt-6 relative">
                                <motion.div 
                                  className="absolute w-24 h-24 bg-red-500 rounded-full blur-2xl opacity-20"
                                  animate={{ 
                                    scale: [1, 1.5, 1],
                                    opacity: [0.1, 0.4, 0.1]
                                  }}
                                  transition={{ 
                                    duration: 0.8, 
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                />
                                <div className="text-[48px] mb-1">🚨</div>
                                <motion.div 
                                  className="text-red-500 font-black text-[22px] tracking-tighter"
                                  animate={{ y: [0, -2, 0] }}
                                  transition={{ duration: 0.5, repeat: Infinity }}
                                >
                                  고카페인 주의!
                                </motion.div>
                              </div>
                            )}

                            {currentCard.category === "탄수화물" && (
                              <div className="flex justify-center -mt-6">
                                <div className="rice-bowl-container scale-75 origin-center">
                                  <motion.div 
                                    className="rice-level" 
                                    initial={{ height: '0%' }}
                                    animate={{ height: `${currentCard.ratioValue}%` }}
                                    transition={{ duration: 1.5, ease: [0.17, 0.67, 0.83, 0.67], delay: 0.3 }}
                                  />
                                  <span className="relative z-0">
                                    {selectedFoodId === "salad" ? "🥗" : selectedFoodId === "shrimp" ? "🌾" : "🍚"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="-mt-4">
                            {currentCard.showGauge && (
                              <div className="w-full h-[12px] rounded-full bg-white/40 shadow-neumo-inset overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${currentCard.ratioValue}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: currentCard.color || 'var(--color-neumo-blue)' }}
                                />
                              </div>
                            )}
                            {currentCard.category === "지방" && (
                              <div className="text-[16px] text-center mt-3 font-black animate-bounce" style={{ color: '#006EE9' }}>
                                👆 탭하여 상세 확인
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Back Face */}
                        <div className="absolute inset-0 bg-[#2d3436] rounded-[30px] p-8 flex flex-col justify-center items-center text-center rotate-y-180 backface-hidden text-white">
                          {currentCard.category === "탄수화물" ? (
                            <div className="flex flex-col items-center justify-center h-full">
                              <div className="rice-bowl-container mb-4">
                                <div className="rice-level" style={{ 
                                  height: isFlipped ? `${currentCard.ratioValue}%` : '0%' 
                                }}></div>
                                <span className="relative z-0">
                                  {selectedFoodId === "salad" ? "🥗" : selectedFoodId === "shrimp" ? "🌾" : "🍚"}
                                </span>
                              </div>
                              <div className="info-text">
                                <div className="text-[18px] font-bold mb-2">탄수화물 함량</div>
                                <div className="text-[14px] opacity-80">
                                  {currentCard.detail}
                                </div>
                              </div>
                            </div>
                          ) : currentCard.category === "지방" ? (
                            <div className="flex flex-col items-center justify-center h-full">
                              <div className="text-[20px] font-black mb-6 border-b border-white/20 pb-2 w-full">지방 상세 정보</div>
                              <div className="space-y-6 w-full">
                                  {currentCard.detail.split('\n').map((line, i) => {
                                    const [label, val] = line.split(': ');
                                    const isSaturatedFat = (selectedFoodId === 'shrimp' || selectedFoodId === 'latte') && label === '포화지방';
                                    return (
                                      <div 
                                        key={i} 
                                        className={`flex justify-between items-center p-4 rounded-xl ${isSaturatedFat ? 'bg-red-500/20 border border-red-500/30' : 'bg-white/10'}`}
                                      >
                                        <span className={`font-bold text-[15px] ${isSaturatedFat ? 'text-red-400' : 'opacity-70'}`}>{label}</span>
                                        <span className={`font-black text-[18px] ${isSaturatedFat ? 'text-red-400' : ''}`}>{val}</span>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          ) : (
                            <div className="text-[16px] leading-[1.7]">
                              {currentCard.detail}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-neumo-text-sub text-[14px] mt-0 px-10 flex flex-col items-center justify-center min-h-[70vh]"
                  >
                    {selectedFoodId === 'cola' ? (
                      <>
                        <motion.div
                          initial={{ scale: 0, rotate: -20 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", damping: 12, delay: 0.2 }}
                          className="mb-4"
                        >
                          <img 
                            src={tamagotchi} 
                            alt="캐릭터" 
                            className="w-32 h-32 object-contain drop-shadow-xl"
                            referrerPolicy="no-referrer"
                          />
                        </motion.div>

                        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-[24px] shadow-neumo-card border border-white/40 mb-8">
                          <p className="font-black text-[16px] text-neumo-blue mb-2">축하합니다! 🎉</p>
                          <p className="font-bold text-[14px] text-gray-600">모든 성분을 꼼꼼히 확인했습니다.</p>
                        </div>
                      </>
                    ) : (
                      <div className="mb-10 text-gray-500 font-bold">
                        성분 확인이 완료되었습니다.
                      </div>
                    )}

                    <button 
                      onClick={() => { 
                        setIsFinished(false); 
                        setCurrentIndex(0); 
                        setSwipeDirection(null); 
                        setHasFlippedCurrentCard(false);
                        setHasViewedIngredients(false);
                        if (selectedFoodId === 'cola') {
                          setActiveTab('home');
                        } else {
                          setActiveTab('explore');
                        }
                      }}
                      className="w-full max-w-[200px] py-4 bg-neumo-blue text-white rounded-2xl font-black shadow-lg active:scale-95 transition-transform"
                    >
                      {selectedFoodId === 'cola' ? '처음으로' : '다음 음식 탐색하러가기'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bibim Kcal Info Character Message */}
              <AnimatePresence>
                {showFlipRequiredAlert && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] bg-red-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-black flex items-center gap-2 whitespace-nowrap"
                  >
                    <span className="text-xl">⚠️</span> 상세 정보부터 확인해줘!
                  </motion.div>
                )}
                {selectedFoodId === 'bibim' && showBibimKcalInfoMessage && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute bottom-24 left-4 flex flex-col items-start pointer-events-none z-[100]"
                  >
                    <div className="bg-white px-4 py-2 rounded-2xl shadow-xl border-2 border-neumo-blue text-[13px] font-black text-gray-800 mb-2 relative ml-4">
                      모든 함량은 2,000kcal 기준이야!
                      <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white border-r-2 border-b-2 border-neumo-blue rotate-45"></div>
                    </div>
                    <img src={tamagotchi} alt="캐릭터" className="w-20 h-20 object-contain drop-shadow-lg" referrerPolicy="no-referrer" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {activeTab === 'explore' && (
          <div className="app-container">
            <div className="main-content">
              <h1 className="screen-title">어떤 영양성분을 확인할까요?</h1>
              <div className="category-grid">
                {categories.map((cat) => (
                  <div 
                    key={cat.id} 
                    className="category-item"
                    onClick={() => {
                      let foodId = '';
                      if (cat.name === '정성 가득 비빔밥') foodId = 'bibim';
                      else if (cat.name === '스모크 닭가슴살 샐러드') foodId = 'salad';
                      else if (cat.name === '새우깡') foodId = 'shrimp';
                      else if (cat.name === '바닐라빈 라떼') foodId = 'latte';
                      else if (cat.name === '코카콜라') foodId = 'cola';

                      if (foodId) {
                        setSelectedFoodId(foodId);
                        setActiveTab('data');
                        setCurrentIndex(0);
                        setIsFinished(false);
                        setIsFlipped(false);
                        setHasFlippedCurrentCard(false);
                        setHasViewedIngredients(false);
                        setShowProductDiagram(false);
                        if (foodId === 'bibim') {
                          setShowBibimCoachMark(true);
                        }
                      }
                    }}
                  >
                    <div className="icon-box">{cat.icon}</div>
                    <span>{cat.id}. {cat.name}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 mb-4 text-center">
                <p className="text-[12px] text-gray-400 font-medium bg-gray-50 py-2 px-6 rounded-full inline-block border border-gray-100">
                  모든 음식을 탐색하면 미션 완료! 🎯
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Food Card Modal */}
        <div id="food-card-modal" className={`modal ${isModalOpen ? '' : 'hidden'}`}>
          {modalFood && (
            <div className="card-container">
              <button className="close-btn" onClick={closeCard}>닫기</button>
              
              <div className="layer layer-summary">
                <img src={modalFood.image} alt={modalFood.fullName} referrerPolicy="no-referrer" />
                <h2>{modalFood.fullName}</h2>
                <p>{modalFood.kcal}</p>
                <div className="swipe-hint">▲ 위로 올려서 상세 정보 보기</div>
              </div>

              <div className="layer layer-nutrition">
                <h3>상세 영양성분</h3>
                <div className="bar-chart">
                  <div className="label">나트륨</div>
                  <div className="bar-bg">
                    <div className="bar" style={{ width: `${modalFood.sodium}%` }}></div>
                  </div>
                  <span id="sodium-pct">{modalFood.sodium}%</span>
                </div>
              </div>

              <div className="layer layer-ingredients">
                <h3>원재료 및 주의사항</h3>
                <p>{modalFood.ingredients}</p>
                {modalFood.hasAllergy && (
                  <div className="warning">⚠️ 캐릭터 알러지 성분 포함!</div>
                )}
                
                <button className="feed-btn" onClick={confirmFeed}>이 음식 먹이기</button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        <div className="bottom-nav">
          <div 
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <Home size={20} className="nav-icon" />
            <span className="nav-label">홈</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <Search size={20} className="nav-icon" />
            <span className="nav-label">탐색</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            <BarChart2 size={20} className="nav-icon" />
            <span className="nav-label">데이터</span>
          </div>
        </div>

      </div>
    </div>
  );
}
