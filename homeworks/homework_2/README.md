<img src="./img/logo.png" alt="Chmurowisko logo" width="200" align="right">
<br><br>
<br><br>
<br><br>

# Praca domowa 2

Witaj w pracy domowej #2! :wave:

W tej pracy domowej rozbudujesz aplikację z pracy domowej #1. Wykorzystasz do tego poznane podczas szkolenia funkcjonalności Kubernetes.

Do aplikacji z pracy domowej #1 został dodany Worker. Worker jest programem, który jest uruchamiany cyklicznie (domyślnie: codziennie o 5:00) w celu pobrania informacji o kursach walut z [API NBP](http://api.nbp.pl/api/exchangerates/tables/c?format=json) i zapisania ich w bazie danych.

## Wstęp

1. **Kod aplikacji**

    Katalogi z kodem aplikacji Frontend, API oraz Worker znajdują się w katalogu [./app/packages](./app/packages). W trakcie pracy domowej możesz zbudować swoje własne obrazy kontenerów i udostępnić je we własnych repozytoriach obrazów na Docker Hub.
  
    Mimo to, nie jest to krok wymagany :point_down:

1. **Obrazy kontenerów z aplikacjami**

    Obrazy kontenerów dla aplikacji Frontend, API oraz Worker znajdujące się w repozytoriach [macborowy/chmurobank-front:latest](), [macborowy/chmurobank-api:latest](), [macborowy/chmurobank-exchangerates-downloader:latest]() zostały zaktualizowane do najnowszej wersji.

    Jeśli nie chcesz budować kontenerów samodzielnie - skorzystaj z gotowych. Są one zbudowane z tej samej wersji kodu co dostępna w katalogu [./app](./app)

1. **Pytania i wątpliwości**

    W razie jakichkolwiek pytań lub wątpliwości wyślij wiadomość na [maciej.borowy@chmurowisko.pl](mailto:maciej.borowy@chumrowisko.pl) i [daniel.pisarek@chmurowisko.pl](mailto:daniel.pisarek@chumrowisko.pl).

---

## Zadanie 1

### 1. Podziel rozwiązanie logicznie na Namespace

#### Po co?

Wraz z biegiem czasu na klastrze może pojawić się coraz więcej obiektów. Dobrym pomysłem jest ich logiczne grupowanie np. według komponentów aplikacji lub domen biznesowych. Obiektem w Kubernetes, który pozwala na logiczne grupowanie jest [Namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/).

#### Kroki

1. Stwórz dwa namespace:

  - `frontend`, w którym udostępnisz obiekty związane z aplikacją Frontend
  - `backend`, w którym udostępnisz obiekty związane z aplikacjami API oraz Worker

#### Podpowiedzi

Sposób tworzenia Namespace i umieszczania w nich komponentów K8s został przedstawiony w ćwiczeniu poświęconym [Namespace (link)](https://github.com/cloudstateu/ic-3-2022/tree/main/Kubernetes/08_namespace).

Jeśli na klastrze posiadasz zasoby, które są już utworzone w Namespace `default` usuń je za pomocą `kubectl delete` i utwórz na nowo we właściwym Namespace.


### 2. Wykorzystanie Ingress do udostępnienia aplikacji poprzez jeden publiczny adres IP

#### Po co?

W pracy domowej #1 aplikacja udostępniona była na dwóch różnych adresach IP. Takie rozwiązanie nie jest pożądane, ponieważ udostępnienie aplikacji w sieci Internet będzie wymagało więcej prac operacyjnych (np. dla każdej kolejnej aplikacji, która powinna być dostępna poza klastrem musimy dodawać kolejne wpisy w DNS).

W sytuacji gdy chcemy udostępnić poza klaster kilka komponentów wchodzących w skład pojedynczej aplikacji powinniśmy zrobić to na jednym adresie IP. Taki mechanizm dostarcza nam [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) oraz [Ingress Controllers](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/).

#### Kroki

1. Zainstaluj ingress-nginx na klastrze
1. Stwórz dwa pliki YAML z konfiguracją obiektu Ingress dla aplikacji w obu Namespace. Wdróż konfigurację na klaster.
1. Sprawdź czy aplikacje odpowiadają na skonfigurowanych przez Ciebie endpoint.

#### Podpowiedzi

Wykorzystaj Ingress Controller [ingress-nginx](https://kubernetes.github.io/ingress-nginx/) w celu udostępnienia aplikacji React oraz API poprzez jeden publiczny adres IP. 
Jeśli podzieliłeś rozwiązanie na dwa Namespace powinieneś stworzyć dwa pliki YAML z konfiguracją obiektu Ingress dla usług w odpowiednich Namespace. Podział konfiguracji obiektu Ingress jest znaną i rekomendowaną praktyką konfigurowania Ingress dla usług w wielu Namespace.

Sposób instalacji i konfiguracji Ingress został przedstawiony w ćwiczeniu poświęconym **Ingress** - [Link do ćwiczenia](https://github.com/cloudstateu/ic-3-2022/tree/main/Kubernetes/12_ingress). Zauważ, że obie aplikacje znajdują się w jednym Namespace, dlatego w ćwiczeniu stworzono tylko jedną konfigurację obiektu Ingress. 

### 3. Stworzenie bazy danych

#### Po co?

Baza danych jest koniecznym elementem tworzonego systemu. Worker zapisuje zebrane dane do bazy danych. API z kolei został zaktualizowany by odczytywać dane z bazy danych.

#### Kroki

1. Utwórz serwer bazy danych w usłudze Azure Database for Postgres
1. Połącz się z serwerem bazy danych (np. przez `psql` z Cloud Shell)
1. Po podłączeniu się do serwera Postgres stwórz nową bazę danych oraz tabelę w której przechowasz dane pobrane z API NBP:

 - Stwórz bazę danych `bank`

    ```bash
    CREATE DATABASE bank;
    ```

- Połącz się z utworzoną bazą danych:

    ```
    \c bank
    ```

- Utwórz nową tabelę `exchangerates`

    ```
    CREATE TABLE exchangerates (
      pid SERIAL PRIMARY KEY,
      currency_from varchar(3),
      currency_to varchar(3),
      buy numeric,
      sell numeric,
      effective_date date,
      created_on timestamp DEFAULT CURRENT_TIMESTAMP
    );
    ```

#### Podpowiedzi

Sposób tworzenia usługi Azure Database for Postgres oraz podłączenia do serwera Postgres przedstawiony w ćwiczeniu poświęconym **integracji z bazą danych** :point_right: [link do ćwiczenia](https://github.com/cloudstateu/ic-3-2022/tree/main/Kubernetes/14_connect_to_azure_database).

### 4. Udostępnij Worker na klastrze za pomocą CronJob

#### Po co?

Worker w tworzonej aplikacji zajmuje się pobraniem danych o kursach walut z API NBP. Worker jest zaimplementowany jako [CronJob](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/), co oznacza, że będzie uruchomiony na klastrze zgodnie z harmonogramem opisanym w konfiguracji obiektu CronJob.

#### Kroki

1. Otwórz plik [./files/4-worker-cronjob.yaml](./files/4-worker-cronjob.yaml) i uzupełnij wartości ConfigMap
1. Wdróż ConfigMap oraz Worker na klaster
1. Za pomocą debuggowego Pod (z Postgres) sprawdź czy Worker pobiera i zapisuje dane z API NBP do bazy danych.

#### Podpowiedzi

Po wdrożeniu Worker na klaster, sprawdź czy pobiera dane z API NBP i wstawia je do bazy. W razie potrzeby zmień harmonogram uruchomienia CronJob (na np. `* * * * *`, czyli uruchomienie Job co minutę).

CronJob powinien korzystać z ConfigMapy, które będzie zawierała informacje pozwalające połączyć się do bazy danych Postgres.

### 5. Podłączenie Key Vault w celu przechowywania w nim sekretów do bazy danych

#### Po co?

Usługa Key Vault pozowli na bezpieczne przechowywanie sekretów do bazy danych, które będą potrzebne aplikacji do łączenia się z bazą danych (API oraz Worker). W momencie uruchomienia kontenera wybrane sekrety z Azure Key Vault zostaną wstrzyknięte do kontenera.

#### Kroki

1. Stwórz instancję usługi Azure Key Vault w Azure Portal
1. Utwórz sekrety w Azure Key Vault z odpowiednimi wartościami dla Twojego środowiska:

    ```bash
    PGDATABASE: bank
    PGHOST: <hostname bazy danych w Azure>
    PGPASSWORD: <haslo użytkownika do bazy danych>
    PGPORT: "5432"
    PGUSER: <użytkownik do bazy danych>
    ```

1. Zainstaluj Secrets Store CSI Driver na klastrze:

    ```bash
    helm install csi csi-secrets-store-provider-azure/csi-secrets-store-provider-azure -n csi --set secrets-store-csi-driver.syncSecret.enabled=true
    ```

1. Uzupełnij plik [files/5-keyvault.yaml](files/5-keyvault.yaml) odpowiednimi wartościami i wdróż go na klaster:

    - `userAssignedIdentityID` - ID Managed Identity, którym przedstawia się AKS do innych usług
    - `keyvaultName` - nazwa utworzonego Key Vault
    - `tenantId`

    Informację jak zdobyć te wartości znajdziesz w ćwiczeniu [Key Valut (ćwiczenie)](https://github.com/cloudstateu/ic-3-2022/tree/main/Kubernetes/16_azure_key_vault_with_azure_database).

1. Stwórz Pod do debugging i sprawdź czy sekrety są pobierane z Key Vault

#### Podpowiedzi

Sposób tworzenia i wykorzystania Key Vault przedstawiono w ćwiczeniu poświęconym [Key Valut (ćwiczenie)](https://github.com/cloudstateu/ic-3-2022/tree/main/Kubernetes/16_azure_key_vault_with_azure_database).

W razie problemów z pobieraniem sekretów z Azure Key Vault do Pod możesz spróbować zdiagnozować problem za pomocą `kubectl describe pod`. Informacje zawarte w sekcji _"Events"_ z pewnością nakierują Cię gdzie szukać problemu.

**Uwaga**: Przedstawiony w ćwiczeniu YAML dla `SecretProviderClass` pozwalał na wstrzykiwanie sekretów do Podów jako Volumes. W tym ćwiczeniu użyjesz mechanizmu wstrzykiwania sekretów przez zmienne środowiskowe. Aby zmienić mechanizm użyj specjalnie przygotowanego YAML z `SecretProviderClass`, który znajdziesz w pliku [./files/5-keyvault.yaml](./files/5-keyvault.yaml).

**Uwaga**: Instalując Key Vault za pomocą Helm upewnij się, że przeciążysz jedną z domyślnych wartości Helm Chart. Ustaw wartość `secrets-store-csi-driver.syncSecret.enabled` na `true` lub wykorzystaj poniższą komendę do instalacji Azure csi-secrets-store-provider-azure:

```bash
helm install csi csi-secrets-store-provider-azure/csi-secrets-store-provider-azure -n csi --set secrets-store-csi-driver.syncSecret.enabled=true
```

### 6. Podłączenie API do bazy danych, tak aby odczytywać informacje o kursach walut

W tym momencie Worker jest usługą odpowiedzialną za pobranie informacji o kursach walut z API NBP. W związku z tym pierwotny kod usługi API został zmieniony, żeby odczytywać dane o kursach walut z bazy danych.

Zaktualizuj Deployment usługi API i sprawdź czy nadal poprawnie wyświetla dane. Do aktualizacji użyj pliku YAML [./files/6-deployment-api.yaml](./files/6-deployment-api.yaml).

**Uwaga**: Usługa API w nowej wersji łączy się z bazą danych. Do połączenia z bazą danych wymaga podania wartości uwierzytelniających przez zmienne środowiskowe. Przygotowany [plik YAML (`./files/6-deployment-api.yaml`)](./files/6-deployment-api.yaml) został przygotowany, aby odczytać wartości z Secret o nazwie `db-secrets` i wstawiać jego wartości do zmiennych środowiskowych w uruchamianych kontenerach. Secret `db-secrets` jest tworzony przez _initContainer_ `sync-secrets` na podstawie konfiguracji `SecretProviderClass`, którą znajdziesz w pliku [./files/5-keyvault.yaml](./files/5-keyvault.yaml).

**Uwaga**: W pliku [./files/6-worker-cronjob-secrets.yaml](./files/6-worker-cronjob-secrets.yaml) znajduje się zaktualizowany kod CronJob dla Worker, który również wykorzystuje wstrzykiwanie informacji uwerzytelniających do bazy danych przez Secret. Zaktualizuj CronJob dla Worker i sprawdź czy nadal działa poprawnie i zapisuje informacje do bazy danych.

#### Kroki

1. Zaktualizuj Deployment usługi API za pomocą pliku [./files/6-deployment-api.yaml](./files/6-deployment-api.yaml)
1. Sprawdź czy API nadal poprawnie zwraca dane
1. Usuń ConfigMap z nazwą `cm-azure-database-connection-details`. ConfigMap znajduje się w Namespace `backend`
1. Zaktualizuj CronJob za pomocą pliku [./files/6-worker-cronjob-secrets.yaml](./files/6-worker-cronjob-secrets.yaml)
1. Sprawdź czy Worker nadal poprawnie wstawia dane do tabeli `exchangerates`

### 7. Skomunikuj ze sobą Frontend i API

#### Po co?

Do tego momentu aplikacja Frontend nie pobierała danych z aplikacji API, ponieważ nigdzie nie skonfigurowaliśmy zmiennej środowiskowej `API_URL` w kontenerze z aplikacją Frontend. Czas to zmienić:

#### Kroki

1. Skonfiguruj Deployment aplikacji Frontend. Dodaj do kontenera z aplikacją Frontend wstrzyknięcie zmiennej środowiskowej `API_URL`. Po skonfigurowaniu Deployment Frontend wdróż go na klaster.
1. Sprawdź czy aplikacja uruchomiona w przeglądarce prezentuje dane o kursach walut

### 8. Wykorzystanie liveness i readiness probe

W aplikacji API zaimplementowano odpowiednie endpointy, do badania stanu życia aplikacji. Są to:

  - dla Liveness Probe: `/health`
  - dla Readiness Probe: `/ready`

Zadaniem endpoint `/health` jest zwrócenie odpowiedzi 200 OK. Zakładamy, że jeśli aplikacja ulegnie jakiejkolwiek awarii lub deadlock i nie będzie wstanie zwrócić odpowiedzi wykonując tak prosty kod to z pewnością nie działa ona poprawnie i wymaga restartu.

Zadaniem endpoint `/ready` jest sprawdzenie czy wszystkie zależności aplikacji są gotowe do pracy. W przypadku aplikacji API istnieje jedna zależność - baza danych. Aplikacja API wymaga, żeby baza danych była wstanie odpowiedzieć na zapytania. Jeśli baza nie będzie odpowiadała to aplikacja API nie zrealizuje swojego zadania, czyli nie zwróci informacji o kursach walut dla potencjalnego klienta.

Wykorzystaj mechanizm Probe w celu automatycznego sprawdzenia czy aplikacje działają poprawnie. Obraz aplikacji [macborowy/chmurobank-api:latest](https://hub.docker.com/r/macborowy/chmurobank-api) zawiera już kod aplikacji z zaimplementowanymi endpoint.

Sposób tworzenia i wykorzystania Liveness Probe został przedstawiony w ćwiczeniu poświęconym **Liveness Probe** - [Link do ćwiczenia](https://github.com/cloudstateu/ic-3-2022/tree/main/Kubernetes/11_probes). Natomiast informację dotyczące tworzenia Readiness Probe  znadują się w dokumentacji Kubernetes - [Link do dokumentacji dotyczącej Readiness Probe](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-readiness-probes)

W celu przetestowania działania Readiness Probe możesz wyłączyć bazę danych w Azure. W ten sposób proste zapytania do bazy danych, które jest wykonywane przez endpoint `/ready` nie powiedzie się i Readiness Probe powinien zwrócić porażkę i w ostatczności odłączyć repliki od Service i w ten sposób nie kierować ruchu do procesów, które nie są w stanie go obsłużyć.

<br><br>

<center><p>&copy; 2022 Chmurowisko Sp. z o.o.<p></center>
