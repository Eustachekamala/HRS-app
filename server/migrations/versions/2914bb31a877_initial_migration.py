"""Initial migration

Revision ID: 2914bb31a877
Revises: 
Create Date: 2024-10-16 16:42:16.069601

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2914bb31a877'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('admins',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=120), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('phone', sa.String(length=120), nullable=False),
    sa.Column('image_path', sa.String(length=120), nullable=False),
    sa.Column('is_admin', sa.Boolean(), nullable=False),
    sa.Column('create_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('blogs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=120), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('link', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=120), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('phone', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=120), nullable=False),
    sa.Column('create_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('services',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('service_type', sa.String(length=120), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('image_path', sa.String(length=255), nullable=False),
    sa.Column('create_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('id_admin', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['id_admin'], ['admins.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('technicians',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=120), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('phone', sa.String(length=120), nullable=False),
    sa.Column('image_path', sa.String(length=120), nullable=False),
    sa.Column('occupation', sa.String(length=120), nullable=False),
    sa.Column('is_admin', sa.Boolean(), nullable=False),
    sa.Column('create_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('id_admin', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['id_admin'], ['admins.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('user_requests',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('service_id', sa.Integer(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('create_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('admin_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['admin_id'], ['admins.id'], ),
    sa.ForeignKeyConstraint(['service_id'], ['services.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('payment_services',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('service_type', sa.String(length=120), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('image_path', sa.String(length=255), nullable=False),
    sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('request_id', sa.Integer(), nullable=False),
    sa.Column('id_admin', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['id_admin'], ['admins.id'], ),
    sa.ForeignKeyConstraint(['request_id'], ['user_requests.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('payment_services')
    op.drop_table('user_requests')
    op.drop_table('technicians')
    op.drop_table('services')
    op.drop_table('users')
    op.drop_table('blogs')
    op.drop_table('admins')
    # ### end Alembic commands ###