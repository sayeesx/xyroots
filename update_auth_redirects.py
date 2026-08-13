import re

def add_redirect(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            text = f.read()

        # Simple replacement
        if 'router.push("/")' not in text:
            # Need strict redirect
            text = re.sub(
                r'if \(!loading && !user\) \{.*?openInstitutionRegistration\(\);.*?\}',
                'if (!loading && !user) {\n      if (typeof window !== "undefined") window.location.href = "/";\n    }',
                text,
                flags=re.DOTALL
            )
            text = re.sub(
                r'if \(!loading && !user\) \{.*?\}',
                'if (!loading && !user) {\n      if (typeof window !== "undefined") window.location.href = "/";\n    }',
                text,
                flags=re.DOTALL
            )
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(text)
    except FileNotFoundError:
        pass

add_redirect('src/app/teachers/page.tsx')
add_redirect('src/app/jobs/page.tsx')
print("Updated page redirects for auth")
