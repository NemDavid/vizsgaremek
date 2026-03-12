# AdminPanel.Tests

Ez a tesztprojekt a jelenlegi app **módosítása nélkül** teszteli azokat a részeket, amelyek értelmesen lefedhetők:

- command logika
- property changed viselkedés
- login validáció
- users/posts/ads/admins szűrés
- selected item -> detail mezők feltöltése
- néhány korai validációs ág privát metódusokon keresztül

## Hova rakd

A projektet így érdemes bemásolni:

```text
AdminPanel/
├─ AdminPanel.sln
├─ AdminPanel/
│  └─ AdminPanel.csproj
└─ tests/
   └─ AdminPanel.Tests/
```

## Solutionhöz adás

1. Nyisd meg a solutiont Visual Studioban.
2. Jobb klikk a solutionre -> **Add -> Existing Project**.
3. Válaszd ki a `tests/AdminPanel.Tests/AdminPanel.Tests.csproj` fájlt.
4. Build Solution.
5. Test Explorer -> Run All.

## Fontos korlát

Mivel a fő app viewmodeljei belül példányosítják a service-eket és több helyen `MessageBox` / HTTP / file dialog fut, ezért a teljes API CRUD flow **nem mockolható tisztán** a fő app módosítása nélkül.

Ez a tesztprojekt ezért a valóban stabilan tesztelhető üzleti/logikai részekre koncentrál.
