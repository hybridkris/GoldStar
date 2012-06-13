"""update users table

Revision ID: 26375e623ec8
Revises: None
Create Date: 2012-06-13 09:57:41.341329

"""

# revision identifiers, used by Alembic.
revision = '26375e623ec8'
down_revision = None

from alembic import op
import sqlalchemy as sa


def upgrade():
	op.drop_column("star","category")
	op.add_column("star",sa.Column("hashtag",sa.Unicode))
	op.add_column("star",sa.Column("tweet",sa.Boolean))

    
def downgrade():
    pass
