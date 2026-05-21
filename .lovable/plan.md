## Причина

RLS-политики `destinations` уже исправлены предыдущей миграцией и идентичны `blog_posts` / `pilgrimages`. Реальная причина ошибки `permission denied for function has_role` — у роли `authenticated` отсутствует `EXECUTE` на функции `public.has_role(uuid, app_role)`.

ACL функции сейчас:
```
{postgres=X/postgres, service_role=X/postgres, sandbox_exec=X/postgres}
```

`authenticated`, `anon` и `PUBLIC` в списке нет, поэтому при вызове `has_role(...)` из RLS-политики под обычным пользователем Postgres возвращает `permission denied`. Это затрагивает и `blog_posts`, и `pilgrimages` — просто там ошибка проявится при первой же реальной попытке записи под не-сервисной ролью.

## Изменение

Одна миграция:

```sql
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role)
  TO authenticated, anon;
```

Функция объявлена как `SECURITY DEFINER` и только читает `public.user_roles` по `user_id`, возвращая boolean — выдача EXECUTE безопасна и не открывает никаких лишних данных.

Политики RLS и код приложения не меняем.

## Проверка

1. `/admin/destinations/new` → создать «Бари» → сохранение проходит без ошибки.
2. Редактирование записи в `/admin/blog` и `/admin/pilgrimages` продолжает работать.
