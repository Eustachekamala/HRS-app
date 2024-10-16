"""Alter the table Technicians

Revision ID: 619a7dbfa94d
Revises: afd5de157e13
Create Date: 2024-10-17 01:21:45.331912

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '619a7dbfa94d'
down_revision = 'afd5de157e13'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('technicians', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True))
        batch_op.alter_column('image_path',
               existing_type=sa.VARCHAR(length=120),
               nullable=True)
        batch_op.alter_column('id_admin',
               existing_type=sa.INTEGER(),
               nullable=True)
        batch_op.drop_column('is_admin')
        batch_op.drop_column('create_at')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('technicians', schema=None) as batch_op:
        batch_op.add_column(sa.Column('create_at', sa.DATETIME(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True))
        batch_op.add_column(sa.Column('is_admin', sa.BOOLEAN(), nullable=False))
        batch_op.alter_column('id_admin',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.alter_column('image_path',
               existing_type=sa.VARCHAR(length=120),
               nullable=False)
        batch_op.drop_column('created_at')

    # ### end Alembic commands ###
