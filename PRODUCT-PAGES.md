# صفحات معلومات المنتجات

تم دمج صفحة محمصة RE-5-096 داخل نفس الموقع في public/products/RE-5-096/index.html مع الصور ودليل PDF.
يظهر زر «اعرف أكثر عن المنتج» في بطاقات المنتج وبطاقات ملفاته ورأس صفحة ملفاته. الزر مستقل عن التحميل والمعاينة.
المنتجات التي لم تُجهز لها صفحة لا تعرض زرًا فارغًا أو رابطًا معطلاً.

## إضافة منتج آخر
1. أضف مجلدًا داخل public/products باسم الموديل يحتوي index.html ووسائطه.
2. أضف رقم الموديل ومسار الصفحة إلى src/data/productPages.ts.
3. يُربط الزر تلقائيًا بالملفات القادمة من Google Drive بحسب productCode، دون تعديل API.
4. أعد بناء ونشر الموقع.

## النشر
نفّذ npm ci ثم npm run typecheck ثم npm run build.
انشر المشروع على نفس الاستضافة الحالية مع الإبقاء على إعدادات وبيئة Google Drive الموجودة. مجلد dist يحتوي الواجهة والصفحة ووسائطها؛ لكنه لا يغني عن وظائف api الموجودة إذا كانت الاستضافة تفصل الواجهة عن الخادم.
لا تغيّر متغيرات Google Drive أو مسارات API.

أُضيفت ملفات سخان الساندويتش المحلية فقط عند غياب موديلها من نتائج Drive، لتجنب تكرار المنتج. عند توفر الموديل في Drive تُستخدم ملفاته الأصلية. بيانات الاتصال غير موجودة في الملف المرفق، لذا يلزم التحقق منها في الاستضافة الحالية بعد التحديث.
زر العودة من صفحة المعلومات يعيد المستخدم إلى ملفات الموديل. الصفحة متاحة كذلك مباشرة دون انتظار تحميل Drive.

جميع أزرار عرض المزيد في صفحة السخان تفتح https://rebune.com/product/contact-grill-re-5-096-re/، ولا توجد أزرار تسوق أو أسعار.

هوية صفحة المنتج مطابقة لألوان المكتبة: البرتقالي #e8601c، الكريمي #fbf6ee، البني الداكن #1f1710، وخطي Cairo وAlexandria مع شعار المكتبة الأصلي.

تحديث تجربة الاستخدام: تعرض الرئيسية بطاقة لكل منتج مع البحث والفلاتر. المنتجات المسجلة في productPages.ts تفتح صفحتها مباشرة. صفحة السخان تجمع نظرة عامة والمواصفات وطريقة الاستخدام والتحميلات في أقسام بروابط تنقل، مع تحميل الدليل مباشرة على الجوال. أقسام الوسائط الأخرى تحتفظ بعرض ملفاتها.


## تجربة التمرير ثلاثية الأبعاد
صفحة /products/RE-5-096/index.html أصبحت تجربة Three.js مستمرة. المصدر products/RE-5-096/index.html وsrc/grill-story.js وsrc/grill-story.css، ويجمع Vite الصفحة مع الواجهة في عملية بناء واحدة.
التجربة التفاعلية بالتمرير هي صفحة المنتج الوحيدة. أُزيلت صفحة التفاصيل التقليدية وروابطها. عند تعذّر العرض التفاعلي، يوجّه زر عرض المزيد إلى موقع ريبون الرسمي. صور المنتج ودليل الاستخدام محفوظة ضمن الأصول.
زر «اكتشف المنتج» يفتح التجربة. نقاط التنقل والتمرير تعمل للأمام والخلف، ويمكن تفعيل تقليل الحركة. عند تعذر WebGL يظهر رابط صفحة التفاصيل.

حدود الدقة: النموذج والأطعمة مبنية برمجيًا من الصور المرجعية وليست ملفات CAD أو مسحًا ثلاثي الأبعاد معتمدًا. الغذاء والخامات تمثيل بصري تقريبي. التفكيك يوضح الأجزاء الخارجية الظاهرة فقط، وليس تعليمات صيانة أو فك للجهاز. للوصول إلى تطابق هندسي وخامات فوتوغرافية يلزم نموذج GLB/CAD موثّق وخامات مصورة.
لم تُختبر اللقطات بصريًا في المتصفح لأن بيئة المعاينة رفضت الاتصال. تم التحقق من البناء والمسارات. يجب مراجعة حركة المفصلة وتفكيك الأجزاء بصريًا قبل نشر النسخة النهائية للجمهور.


RE-7-122: Arabic scroll journey at /products/RE-7-122/index.html. Uses the unmodified original PNG with proportional scroll zoom and ambient lighting, not a reconstructed 3D model. Facts sourced from supplied manual and introduction form. Dimensions omitted because sources disagree. CTA links to rebune.com pending a specific product URL.

RE-7-122 updated: procedural Three.js 3D reconstruction based on supplied views. Scroll controls camera, lights and external assembly separation. Animated illustrative flame and mist. Geometry is approximate; no verified internal assembly claimed. Heater entry now products/RE-7-122/index.html; built through Vite.

RE-7-122 now loads the supplied REBUNE_Heater.glb with GLTFLoader. Original GLB bytes and materials preserved. No generated heater geometry remains. Scroll separates named exterior nodes reversibly. Remote remains procedural. Blender file is a source reference and is not required in the web deployment.
